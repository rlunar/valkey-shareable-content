# Slide decks site (CDK, Python)

Publishes the Slidev presentations listed in [`../../sessions/slidecks.yaml`](../../sessions/slidecks.yaml) as one static site: a private S3 bucket fronted by CloudFront, one subfolder per deck, and a generated landing page at the root that links to each deck.

```
https://<distribution>/                                   generated index.html
https://<distribution>/open-source-as-the-foundation-for-the-ai-era/
https://<distribution>/well-architected-on-a-budget/
https://<distribution>/valkey-slidev/
```

## What the stack creates

`SlideDecksStack` (`slide_decks/site_stack.py`):

- S3 bucket: all public access blocked, bucket-owner-enforced ownership (no ACLs), SSE-S3 encryption, TLS 1.2+ required by bucket policy. The only read grant is `s3:GetObject` for CloudFront through an origin access control, conditioned on this distribution's ARN. The bucket is removed (and emptied) with the stack because everything in it is rebuilt from this repository.
- CloudFront distribution: HTTPS only (HTTP redirects), HTTP/2 and HTTP/3, compression, the managed `CachingOptimized` policy, and a response headers policy adding HSTS, `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy`.
- CloudFront Function (`slide_decks/cloudfront/spa_router.js`, viewer request): Slidev uses history-mode routing, so `/<deck>/12` or `/<deck>/presenter/3` are rewritten to `/<deck>/index.html`, and `/<deck>` redirects to `/<deck>/`. Missing objects return the generated `404.html`.
- One `BucketDeployment` pair per deck (HTML with `max-age=0, must-revalidate`, everything else with `max-age=86400`) uploading `<deck>/dist/` under the `<deck>/` prefix and pruning stale files, plus a root deployment for `index.html` and `404.html` that invalidates `/*` once at the end.

Nothing in front of CloudFront authenticates viewers: the bucket is private, but the site itself is public to anyone with the URL.

## Prerequisites

- Python 3.11+ and Node.js 20.19+ with pnpm (the decks build with pnpm).
- AWS CDK CLI: `npm install -g aws-cdk` or use `npx aws-cdk`.
- AWS credentials for the target account, and a bootstrapped environment (`cdk bootstrap aws://ACCOUNT/REGION`, once).

## Setup

```bash
cd infrastructure/cdk-infra
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

The project also includes `pyproject.toml` and `uv.lock`, so the equivalent uv setup is:

```bash
cd infrastructure/cdk-infra
uv sync
```

## Interactive deployment manager

Install [Gum](https://github.com/charmbracelet/gum) and start the deployment manager from `infrastructure/cdk-infra`:

```bash
brew install gum
./scripts/manage_deployments.sh
```

The manager can set up the Python environment, build all or selected decks, synthesize the stack, show the deployment diff, deploy, bootstrap an AWS environment, or destroy the stack. It reads the AWS caller identity before AWS actions and shows the selected profile, account, region, and caller. The guided deployment follows the documented build, synth, diff, and deploy sequence. Bootstrap, production or unknown deployments, and stack destruction require explicit target confirmation.

The destroy action removes the CloudFront distribution and empties and deletes the unversioned deployment bucket. Use it only when the entire published site should be permanently removed from AWS.

## Build the decks

Every deck must be built with `--base /<name>/` so its assets and router resolve under its subfolder. The helper reads `slidecks.yaml` and does that for each deck:

```bash
python scripts/build_decks.py                 # pnpm install + slidev build for every deck
python scripts/build_decks.py --skip-install  # reuse node_modules
python scripts/build_decks.py valkey-slidev   # only one deck
```

`cdk synth` fails with a clear message if any deck listed in `slidecks.yaml` has no `dist/index.html`.

## Deploy

```bash
cdk synth
cdk diff      # review before deploying to an account that already has the stack
cdk deploy
```

The outputs include `SiteUrl` plus one `DeckUrl...` per deck. First deployment takes about 5 to 10 minutes (CloudFront); later ones finish when the invalidation completes.

## Adding a deck

1. Create the Slidev project as a subfolder of `sessions/` (it needs a `slides.md`).
2. Add an entry under `decks` in `sessions/slidecks.yaml` with `name` (the folder name), `title`, and optionally `description` and `event`.
3. Run `python scripts/build_decks.py <name>` and `cdk deploy`.

Removing an entry from `sessions/slidecks.yaml` stops uploading that deck; its objects stay in the bucket until removed by hand (the root deployment never prunes).

## Notes

- The stack is environment-agnostic apart from `CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`; CloudFront with an S3 origin works from any region.
- A custom domain is not configured. Adding one needs an ACM certificate in `us-east-1` and `domain_names` / `certificate` on the distribution; that is also the only way to raise the viewer TLS policy (`minimum_protocol_version`), which CloudFront fixes for the default `*.cloudfront.net` certificate.
- Access logging (S3 server access logs or CloudFront standard logs) is not enabled; add a log bucket if the site needs an audit trail.
