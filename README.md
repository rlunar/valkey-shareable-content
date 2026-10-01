# Valkey shareable content

A reusable content library for Valkey developers and maintainers: brand assets,
presentation and video templates, animations, and the material for individual
talks. There is no application code here — the "code" is the scripts and
templates used to produce presentations, videos, animations, and short demos.

## Layout

| Folder | What lives here |
|---|---|
| `valkey-brand/` | Valkey brand assets: logos, fonts, wallpapers, gradients, brand guidelines, and the `ValkeyDesignSystem/` component kit. |
| `external-assets/` | Third-party org logos used in talks (Linux Foundation, AWS Open Source, DocumentDB, etc.). |
| `sessions/` | One subfolder per talk, named for the deck. Holds the actual Slidev presentations plus `slidecks.yaml`, the registry the deployment reads. |
| `slides/` | Reusable slide **templates** and tooling (python-pptx layout/SVG helpers, placeholder decks, icons). Not individual talks. |
| `videos/` | Reusable video templates and the HyperFrames capture tooling for reels, shorts, and tutorials. |
| `animations/` | Stock of animated Valkey topic explainers (e.g. caching strategies). |
| `infrastructure/` | Cloud deployment of the public assets. `cdk-infra/` publishes the Slidev decks listed in `sessions/slidecks.yaml` to S3 + CloudFront. |

Skill and agent docs (`slides-skill.md`, `CLAUDE.md`) stay at the repository root.

## Publishing talks

The decks in `sessions/` are published as one static site by the CDK app in
`infrastructure/cdk-infra/`. Each entry in `sessions/slidecks.yaml` maps a
`sessions/` subfolder to a URL path and S3 prefix. See
[`infrastructure/cdk-infra/README.md`](infrastructure/cdk-infra/README.md) for
the build and deploy workflow.

To add a talk: create a Slidev project under `sessions/<name>/` (with a
`slides.md`), add an entry to `sessions/slidecks.yaml`, then build and deploy.
