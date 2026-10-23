# Open Source como Base para a Era da IA: da Infraestrutura Essencial às Aplicações Agênticas

A Slidev closing keynote for AWS Community Day Curitiba on September 19, 2026. The talk is designed for approximately 43 minutes plus a short Q&A inside a 45-minute slot, and uses English narration with Portuguese lines at the emotional beats.

## Session arc

The deck follows seven acts:

1. The career door open source opened.
2. Why consequential AI must be inspectable to earn trust, with OpenClaw and KiroCrew as the open-source loop in practice.
3. What Valkey is and why community outlives licenses, then the open source pyramid beneath AI: Linux → Kubernetes → data/state → application/AI.
4. How those layers work together through semantic caching and an agentic data path.
5. Why public, permanent, portable work matters for a developer’s career.
6. Concrete contribution on-ramps at every layer.
7. Three asks: choose one project, ship one contribution, bring one person in.

The recurring stack visual is implemented in `components/OpenSourcePyramid.vue`. `components/SemanticCacheDiagram.vue` traces the semantic fast path, `components/AgenticDataPath.vue` follows a Strands support agent through cache, memory, retrieval, inference, and durable state, and `components/ValkeyProfile.vue` introduces Valkey with icons rather than prose.

## Presenter identity

Copy `.env.example` to `.env`, then edit:

```dotenv
SPEAKER="Roberto Luna Rojas"
TITLE="Sr. Developer Advocate (Valkey)"
COMPANY="AWS"
```

The cover and closing slide read these values through `components/PresenterIdentity.vue`. Restart the development server after changing `.env`.

## Run the deck

Requires Node.js 20.19 or later and pnpm.

```bash
pnpm install
pnpm run dev
```

Slidev prints the local URL, normally `http://localhost:3030`.

## Build and export

```bash
pnpm run build
pnpm run export
pnpm run export:clicks
```

- `pnpm run build` creates the static site in `dist/`.
- `pnpm run export` creates `open-source-foundation-ai-era.pdf`.
- `pnpm run export:clicks` creates `open-source-foundation-ai-era-with-clicks.pdf` with every reveal state.

## Speaker notes

Every slide in `slides.md` ends with an HTML comment containing presenter notes, and each note has the same shape:

- Above the `***` rule: only the words spoken on stage, in first person, with `[click]` markers at the exact reveal points so the presenter view highlights the right paragraph. The count of markers on a slide always equals its `clicks:` budget.
- Below the rule: bullet comments that are not spoken, such as pauses, evidence caveats, source references, and the cumulative time check. The target at the final slide is 43:15, leaving about two minutes for Q&A inside the 45-minute slot.

`OpenSourceAsTheFoundationForTheAIEra.md` collects the same notes in reading order, one section per slide, followed by a table of the time checks. `slides.md` remains the canonical source.

The OpenClaw and KiroCrew examples are speaker-confirmed and appear on two dedicated slides after the open-source loop: OpenClaw as viral open source that was imperfect, was fixed in the open, and opened a door for its creator (who joined OpenAI in February 2026), and KiroCrew as AWS’s security-first take on the same idea, built internally and opened on GitHub. The KiroCrew framing is the speaker’s own and the notes say so.

## Project structure

- `slides.md`: canonical 26-slide presentation source and presenter notes.
- `OpenSourceAsTheFoundationForTheAIEra.md`: the presenter notes compiled in reading order, spoken text first and comments below, plus the time-check table.
- `style.css`: Valkey-branded keynote layouts.
- `components/OpenSourcePyramid.vue`: recurring four-tier stack visual with reveal and focus modes.
- `components/SemanticCacheDiagram.vue`: semantic-cache request trace.
- `components/AgenticDataPath.vue`: five-step agent data path.
- `components/ValkeyProfile.vue`: the “What is Valkey” visual (workload icons, BSD license, Linux Foundation backing, the eight-day origin story, and the Technical Steering Committee affiliations), using the shared stroke icons from the repository’s `valkey-brand/icons/` through the `@valkey-slide-icons` alias and participant logos from `valkey-brand/ValkeyDesignSystem/assets/participants/` through `@valkey-assets`; Tencent Cloud and Alibaba Cloud live in `assets/public/logos/tsc/`, while Apple® is rendered as plain text.
- `assets/images/`: the OpenClaw banner and star-growth chart, the KiroCrew session screenshot, and the LinkedIn QR code used on the closing slide. These are referenced relatively from `slides.md`, so they stay outside the public folder.
- `assets/public/logos/`: local project SVGs; provenance is documented in `assets/public/logos/README.md`.
- `Keynote_Outline.md` and `Keynote_Script.md`: editorial sources.
- `vite.config.mjs`: serves `assets/public/`, injects presenter identity, and aliases official Valkey assets.

## Navigation aliases

Useful direct routes include:

- `/career-door`
- `/trust-anchor`
- `/openclaw`
- `/kirocrew`
- `/what-is-valkey`
- `/community`
- `/open-source-stack`
- `/semantic-cache`
- `/benchmark`
- `/agentic-path`
- `/onramps-data`
- `/three-asks`
- `/close`

Append `?clicks=N` to inspect a particular reveal state.

## Evidence and wording guardrails

- Heartbleed is used as an inspectability and coordinated-remediation example. The deck does not claim that openness prevents vulnerabilities.
- Open code, open weights, and open data are presented as distinct boundaries. Fully open training data is explicitly described as difficult because of licensing, privacy, and scale.
- The semantic-cache benchmark keeps cost savings, latency reduction, cached-answer accuracy, workload context, and source together.
- The 86% inference figure and up-to-55% database-cost opportunity remain separate claims about different bills and workloads.
- Contribution URLs point to stable project or developer roots rather than promising that a specific issue or label will still be current on presentation day.
- The OpenClaw slide quotes only what its chart shows (346K stars by April 2, 2026, passing React on March 3, 2026) and the creator’s move to OpenAI in February 2026; star totals keep moving, so the notes tell the speaker not to quote a live count without checking it that day.
- The Valkey slide states the eight-day gap between the Redis relicensing (March 20, 2024) and the Linux Foundation announcement of Valkey (March 28, 2024), and the eight Technical Steering Committee affiliations listed in the project’s `MAINTAINERS.md`.

## Sources

- [OpenSSL Heartbleed advisory](https://www.openssl.org/news/secadv/20140407.txt)
- [Heartbleed reference site](https://heartbleed.com/)
- [Lower cost and latency for AI using Amazon ElastiCache as a semantic cache with Amazon Bedrock](https://aws.amazon.com/blogs/database/lower-cost-and-latency-for-ai-using-amazon-elasticache-as-a-semantic-cache-with-amazon-bedrock/)
- [OpenClaw](https://github.com/openclaw/openclaw) and [OpenClaw creator Peter Steinberger joins OpenAI (TechCrunch, February 15, 2026)](https://techcrunch.com/2026/02/15/openclaw-creator-peter-steinberger-joins-openai/)
- [KiroCrew](https://github.com/kirodotdev/KiroCrew)
- [Valkey maintainers and Technical Steering Committee](https://github.com/valkey-io/valkey/blob/unstable/MAINTAINERS.md)
- [Linux Kernel Newbies](https://kernelnewbies.org/)
- [Kubernetes contributor guide](https://www.kubernetes.dev/docs/guide/)
- [Valkey](https://github.com/valkey-io/valkey)
- [OpenSearch project](https://github.com/opensearch-project)
- [PostgreSQL developer resources](https://www.postgresql.org/developer/)
- [PyTorch](https://github.com/pytorch/pytorch)
- [vLLM](https://github.com/vllm-project/vllm)
- [Strands Agents](https://github.com/strands-agents)

## Speaker

Roberto Luna Rojas is a Sr. Developer Advocate for Valkey at AWS. He has developed software since the mid-1990s, with a focus on performance, scalability, and open source communities.
