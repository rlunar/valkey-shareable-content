# Well-Architected on a Budget

**Cutting Database and AI Inference Cost with Valkey**

A Slidev presentation for AWS Community Day Argentina 2026. Presenter name, title, and company are configured through `.env`.

## Session description

Repeated work becomes expensive work at scale. This session applies one architectural shape twice: put a fast Valkey layer in front of an expensive dependency, return safe cache hits immediately, and perform the expensive work only on misses.

The first pattern is cache-aside in front of a relational database. The second is semantic caching with Valkey Search in front of an LLM. Each decision maps to Cost Optimization, Performance Efficiency, and Reliability.

The deck deliberately avoids unsourced general-purpose performance and cost percentages. Its semantic-cache benchmark slide names the workload context, answer-accuracy tradeoff, and source.

## Presenter identity

Copy `.env.example` to `.env`, then edit these values:

```dotenv
SPEAKER="Roberto Luna-Rojas"
TITLE="Sr Open Source Developer Advocate"
COMPANY="AWS"
```

The first and final slides read the presenter name, title, and company from these variables. Restart the Slidev development server after changing `.env`.

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
- `pnpm run export` creates the standard PDF.
- `pnpm run export:clicks` creates a PDF containing every click state.

## Project structure

- `slides.md`: canonical presentation source, including presenter notes.
- `style.css`: Valkey-branded layout and deck-specific styling.
- `components/`: animated Vue/SVG diagrams and shared brand components.
- `assets/public/`: runtime logos and QR artwork served by Vite.
- `assets/diagrams/`: original D2 diagram sources and rendered SVG experiments.
- `assets/qa/` and `assets/validation/`: visual review captures.
- `vite.config.mjs`: serves `assets/public/` and aliases official assets from `../../valkey-brand/ValkeyDesignSystem/assets`.
- `valkey-budget-talk-content.md`: editorial source and long-form outline.
- `valkey-budget-talk.slidev.md`: original draft retained for comparison.
- `valkey-budget-talk.marp.md`: legacy Marp draft; not the canonical deck.

## Navigation aliases

Useful routes include:

- `/cost-problem`
- `/cache-aside`
- `/semantic-cache`
- `/benchmark`
- `/pillar-matrix`
- `/resources`

Append `?clicks=N` to inspect a specific click state.

## Evidence and wording

The deck distinguishes measured evidence from general architecture guidance:

- The database economics slide uses illustrative arithmetic and asks the audience to benchmark its own request mix, hit rate, latency, and total cost.
- The AI benchmark slide cites the AWS Database Blog evaluation and includes cost savings, latency reduction, cached-answer accuracy, dataset size, model, embedding model, and cache node.
- Raw KNN code uses cosine distance, where lower is closer. Higher-level APIs may expose similarity, where higher is better.
- Valkey vector search requires Valkey Search or a managed service version that supports the capability. It is not implied by every plain Valkey deployment.
- Read replicas used for high availability or recovery must not be removed as a cost optimization.

## Sources

- [Valkey](https://valkey.io/)
- [Introducing Vector Search to Valkey](https://valkey.io/blog/introducing-valkey-search/)
- [Lower cost and latency for AI using Amazon ElastiCache as a semantic cache with Amazon Bedrock](https://aws.amazon.com/blogs/database/lower-cost-and-latency-for-ai-using-amazon-elasticache-as-a-semantic-cache-with-amazon-bedrock/)

## Speaker

Roberto Luna Rojas is a Sr. Developer Advocate for Valkey based in the United States and originally from Mexico. He has developed software since the mid-1990s, with a focus on performance and scalability. Outside work, he enjoys spending time with his family, listening to music, and watching movies, television, and sports.
