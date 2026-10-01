"""Private S3 bucket + CloudFront distribution hosting the Slidev decks."""

from __future__ import annotations

from pathlib import Path

from aws_cdk import (
    CfnOutput,
    Duration,
    RemovalPolicy,
    Stack,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_s3 as s3,
    aws_s3_deployment as s3deploy,
)
from constructs import Construct

from .config import Deck, SlideDecksConfig
from .pages import render_index_html, render_not_found_html

_SPA_ROUTER_SOURCE = Path(__file__).parent / "cloudfront" / "spa_router.js"

# HTML entry points must always revalidate so a redeploy is visible at once.
_HTML_CACHE = s3deploy.CacheControl.from_string("public, max-age=0, must-revalidate")
# Everything else (Vite-hashed bundles plus the deck's public/ files) can be
# cached by browsers for a day; CloudFront itself is invalidated on deploy.
_ASSET_CACHE = s3deploy.CacheControl.from_string("public, max-age=86400")


class SlideDecksStack(Stack):
    """One bucket, one distribution, one subfolder per deck in slidecks.yaml."""

    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        *,
        config: SlideDecksConfig,
        price_class: cloudfront.PriceClass = cloudfront.PriceClass.PRICE_CLASS_ALL,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        _ensure_decks_are_built(config)

        bucket = s3.Bucket(
            self,
            "SiteBucket",
            # Nothing reaches the bucket except CloudFront through the origin
            # access control below; there is no public or cross-account access.
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            object_ownership=s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            encryption=s3.BucketEncryption.S3_MANAGED,
            enforce_ssl=True,
            minimum_tls_version=1.2,
            versioned=False,
            # The content is rebuilt from this repository, so the bucket can
            # go away with the stack.
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )

        spa_router = cloudfront.Function(
            self,
            "SpaRouter",
            comment="Route Slidev deep links to each deck's index.html",
            runtime=cloudfront.FunctionRuntime.JS_2_0,
            code=cloudfront.FunctionCode.from_file(file_path=str(_SPA_ROUTER_SOURCE)),
        )

        security_headers = cloudfront.ResponseHeadersPolicy(
            self,
            "SecurityHeaders",
            comment="Security headers for the slide decks site",
            security_headers_behavior=cloudfront.ResponseSecurityHeadersBehavior(
                content_type_options=cloudfront.ResponseHeadersContentTypeOptions(override=True),
                frame_options=cloudfront.ResponseHeadersFrameOptions(
                    frame_option=cloudfront.HeadersFrameOption.SAMEORIGIN, override=True
                ),
                referrer_policy=cloudfront.ResponseHeadersReferrerPolicy(
                    referrer_policy=cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
                    override=True,
                ),
                strict_transport_security=cloudfront.ResponseHeadersStrictTransportSecurity(
                    access_control_max_age=Duration.days(365),
                    include_subdomains=True,
                    override=True,
                ),
            ),
        )

        distribution = cloudfront.Distribution(
            self,
            "Distribution",
            comment=f"{config.site.title} (Slidev decks)",
            default_root_object="index.html",
            default_behavior=cloudfront.BehaviorOptions(
                # Grants CloudFront s3:GetObject on this bucket only, scoped to
                # this distribution's ARN, and keeps the bucket otherwise closed.
                origin=origins.S3BucketOrigin.with_origin_access_control(bucket),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowed_methods=cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cache_policy=cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress=True,
                response_headers_policy=security_headers,
                function_associations=[
                    cloudfront.FunctionAssociation(
                        function=spa_router,
                        event_type=cloudfront.FunctionEventType.VIEWER_REQUEST,
                    )
                ],
            ),
            # Without s3:ListBucket a missing key surfaces as 403; both map to
            # the generated 404 page.
            error_responses=[
                cloudfront.ErrorResponse(
                    http_status=status,
                    response_http_status=404,
                    response_page_path="/404.html",
                    ttl=Duration.minutes(1),
                )
                for status in (403, 404)
            ],
            http_version=cloudfront.HttpVersion.HTTP2_AND_3,
            # minimum_protocol_version only takes effect with a custom
            # certificate; the default *.cloudfront.net certificate fixes it.
            price_class=price_class,
            enable_ipv6=True,
        )

        deck_deployments = [
            deployment
            for deck in config.decks
            for deployment in self._deploy_deck(deck, bucket)
        ]

        # The landing page and 404 page live beside the deck prefixes, so this
        # deployment must not prune. It runs last and triggers the single
        # CloudFront invalidation for the whole release.
        root_pages = s3deploy.BucketDeployment(
            self,
            "DeployRootPages",
            sources=[
                s3deploy.Source.data("index.html", render_index_html(config)),
                s3deploy.Source.data("404.html", render_not_found_html(config)),
            ],
            destination_bucket=bucket,
            prune=False,
            cache_control=[_HTML_CACHE],
            distribution=distribution,
            distribution_paths=["/*"],
        )
        for deployment in deck_deployments:
            root_pages.node.add_dependency(deployment)

        CfnOutput(self, "SiteUrl", value=f"https://{distribution.distribution_domain_name}/")
        CfnOutput(self, "DistributionId", value=distribution.distribution_id)
        CfnOutput(self, "BucketName", value=bucket.bucket_name)
        for deck in config.decks:
            CfnOutput(
                self,
                f"DeckUrl{_pascal_case(deck.name)}",
                value=f"https://{distribution.distribution_domain_name}{deck.base_path}",
                description=deck.title,
            )

    def _deploy_deck(self, deck: Deck, bucket: s3.IBucket) -> list[s3deploy.BucketDeployment]:
        """Upload one deck's dist/ under its prefix with per-file-type caching.

        Two deployments share one asset (same path, same hash) and split the
        files by pattern. `exclude` also protects matching objects from being
        pruned, so each deployment only removes stale files of its own kind.
        """
        source = s3deploy.Source.asset(
            str(deck.dist_dir),
            # Netlify-only redirect rules emitted by Slidev; irrelevant on S3.
            exclude=["_redirects"],
        )
        deck_id = _pascal_case(deck.name)

        assets = s3deploy.BucketDeployment(
            self,
            f"Deploy{deck_id}Assets",
            sources=[source],
            destination_bucket=bucket,
            destination_key_prefix=deck.name,
            exclude=["*.html"],
            cache_control=[_ASSET_CACHE],
            prune=True,
        )
        html = s3deploy.BucketDeployment(
            self,
            f"Deploy{deck_id}Html",
            sources=[source],
            destination_bucket=bucket,
            destination_key_prefix=deck.name,
            exclude=["*"],
            include=["*.html"],
            cache_control=[_HTML_CACHE],
            prune=True,
        )
        return [assets, html]


def _ensure_decks_are_built(config: SlideDecksConfig) -> None:
    missing = [deck for deck in config.decks if not (deck.dist_dir / "index.html").is_file()]
    if missing:
        names = ", ".join(deck.name for deck in missing)
        raise FileNotFoundError(
            f"No Slidev build output for: {names}. "
            "Run cdk-infra/scripts/build_decks.py (which passes --base /<name>/ to "
            "`slidev build`) before synthesizing or deploying."
        )


def _pascal_case(name: str) -> str:
    """'well-architected-on-a-budget' -> 'WellArchitectedOnABudget' (for IDs)."""
    return "".join(part.capitalize() for part in name.split("-") if part)
