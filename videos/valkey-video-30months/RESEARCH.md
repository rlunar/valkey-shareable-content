# Research for the revised Valkey video

Checked October 2, 2026. This 120-second revision replaces the earlier 60-second script. The employee now explicitly requires the exact website definition, releases, modules, integrations, 19 use cases and participant logos without Apple, plus memory/disk, SET, cache-aside, semantic-cache and Docker scenes.

## Research scope

Reviewed the official website, participant and client pages, engine release listing, Search release/announcement material, selected GitHub READMEs, and core documentation for counters, Streams, Pub/Sub, distributed locks, JSON and Bloom filters. Reviewed the official AI-workloads article for inference KV-cache offload and semantic caching. This is a documentation review, not a source-code audit or benchmark test.

## Release board

- The homepage features **9.1.2** for the 9.x line, **8.1.10** for 8.x and **7.2.14** for 7.x. The latter two are presented as the latest supported versions of past releases. These are homepage selections, not a complete support-policy matrix. [[1]](https://valkey.io/)
- The engine release listing includes **9.2.0-rc1**, explicitly marked **Pre-release**, released September 16, 2026. Keep it visually separate from the stable selections. [[2]](https://github.com/valkey-io/valkey/releases)
- Patch numbers are volatile. Recheck immediately before publication. Do not add release performance figures without their benchmark context.

## Modules and integrations

- **valkey-json** adds structured JSON storage and JSONPath operations and must be loaded as a module. [[6]](https://valkey.io/topics/valkey-json/)
- **valkey-search** adds vector indexes and search; the Search 1.2 announcement confirms full-text support, filtering and aggregations. Full-text is not inferred merely from the repository name. [[7]](https://valkey.io/blog/valkey-search-1_2/) [[8]](https://github.com/valkey-io/valkey-search)
- **valkey-bloom** provides probabilistic membership. False positives are possible; it is a candidate-filtering component, not a fraud classifier. [[9]](https://valkey.io/topics/bloomfilters/)
- **valkey-ldap** handles authentication through LDAP identity providers. Do not describe it as a full identity-management system. [[10]](https://github.com/valkey-io/valkey-ldap)
- **Valkey GLIDE** is an official client project with a Rust core and language bindings. Its ecosystem README lists @fastify/valkey-glide, rate-limiter-flexible, aiocache, Powertools for AWS Lambda idempotency integrations, and redlock-universal. The short video highlights GLIDE, Fastify and Powertools, without implying equal feature coverage in every language/version. [[4]](https://github.com/valkey-io/valkey-glide)
- **Spring Data Valkey** provides a Spring Boot starter, caching and repository abstractions. It is the evidence for the Spring Boot integration label. [[5]](https://github.com/valkey-io/spring-data-valkey)
- The official AI-workloads article maps LLM tensor KV-cache offload to Valkey as a shared tier through inference connectors, and semantic caching to valkey-search plus embeddings and application policy. Neither means Valkey generates embeddings or performs inference. [[11]](https://valkey.io/blog/modern-ai-workloads-mapping-to-valkey/)

## Organization analysis

The organization spans the engine (valkey), application clients (GLIDE and language-specific clients), modules (JSON, Search, Bloom, LDAP), integrations (Spring Data Valkey), and operations/distribution (container images, bundles, Helm, admin tooling). Documentation and community repositories support adoption and contributions. Repository existence alone does not establish production readiness, maintenance commitments, security guarantees or compatibility with every release. [[18]](https://github.com/valkey-io)

The original inventory snapshot contained 48 public repositories, 46 not archived. That earlier count is not re-used as a current popularity or maturity claim and is omitted from the film.

## Definition and claims

- The exact definition requested by the employee is reproduced verbatim in SCRIPT.md and NARRATION.txt, including the project's “open source forever” commitment. It is attributed to Valkey's website in the visual direction. [[1]](https://valkey.io/)
- BSD licensing refers to the core Valkey project; do not assume every dependency, repository or asset has the same license.
- The 19-use-case technical mapping is in USE_CASES.md. Distinguish built-in primitives, loadable modules, integrations and application patterns.
- Avoid universal compatibility, zero downtime, exactly-once processing, lossless failover, always-unique IDs, or risk-free locks. Persistence and failure handling require deployment-specific design.
- Streams provides an append-only-log model with trimming/deletion; AOF is a separate persistence mechanism. Pub/Sub does not persist messages for disconnected subscribers. [[14]](https://valkey.io/topics/streams-intro/) [[15]](https://valkey.io/topics/pubsub/)

## Participant artwork

The current official participant page and homepage expose 21 participant marks. Their exact asset URLs were checked and all returned HTTP 200 with image content types. They are listed in PARTICIPANT_LOGOS.json and LOGOS.md. The current inspected pages did not expose an Apple participant mark; Apple remains explicitly excluded even if the roster later changes. [[3]](https://valkey.io/participants/)

The employee has requested participant-logo use and explicitly states Apple is not permitted. This brief treats non-Apple participants as the requested set; no independent rights audit is claimed. Do not infer a public website grants unrestricted trademark rights. Preserve each participant's approved mark, clear space, color and presentation rules. The final video must not imply participant endorsement of this specific video.

No image files, voice recording, composition or video have been generated in this script revision. Logo URLs were checked, but the artwork has not been rendered for visual QA. Official brand guidelines remain a required production review. [[19]](https://github.com/valkey-io/assets/blob/main/Valkey%20Branding/valkey_brand_guidelines.pdf)

## Evidence and caveats for the five new scenes

- **Memory versus disk:** Valkey's introduction explicitly describes its in-memory working dataset and optional disk persistence. The opening uses the general hardware distinction qualitatively. There is no measured latency comparison or multiplier. The client-side caching docs also explain why local memory access must not be equated with a network round trip to Valkey. [[22]](https://valkey.io/topics/introduction/) [[16]](https://valkey.io/topics/persistence/) [[26]](https://valkey.io/topics/client-side-caching/)
- **Cache-aside:** the application checks the cache; a miss triggers a database read and cache population; subsequent hits avoid that database query. Invalidation after a database update is part of consistency management. The architecture reference is implementation-neutral evidence for the pattern, not an endorsement of another vendor's product. Valkey is positioned as the cache in our diagram. No reviewed source establishes the user's proposed most-common ranking, so the narration calls it a common starting point and emphasizes it editorially. [[23]](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
- **SET example:** SET Key Value / OK / GET Key / "Value" uses the documented basic string command. The related SET product:42 "blue mug" EX 60 example illustrates cache population with expiry. Expected output only; neither was executed against a server. [[21]](https://valkey.io/commands/set/)
- **Semantic caching:** vector similarity yields candidates, not a universal answer-validity guarantee. Scope, context, freshness and policy determine reuse. The animation uses public geography questions and does not share personal answers between users. Threshold values and embeddings are not fabricated. [[11]](https://valkey.io/blog/modern-ai-workloads-mapping-to-valkey/)
- **Docker correction:** the employee supplied docker run --rm valkey/valkey-alpine. Its repository endpoint returned HTTP 404, while the official valkey/valkey alpine-tag endpoint returned HTTP 200 and active status. The final frame uses docker run --rm valkey/valkey:alpine instead. The command was not executed. It starts the core server, not all modules, and does not publish ports or establish a durable production deployment. [[24]](https://hub.docker.com/v2/repositories/valkey/valkey/tags/alpine) [[25]](https://hub.docker.com/v2/repositories/valkey/valkey-alpine/)

## Source index

- [[1]](https://valkey.io/) Valkey homepage and featured stable release lines
- [[2]](https://github.com/valkey-io/valkey/releases) Valkey engine releases, including 9.2.0-rc1 marked pre-release
- [[3]](https://valkey.io/participants/) Valkey participant roster and logo artwork
- [[4]](https://github.com/valkey-io/valkey-glide) GLIDE clients and ecosystem integrations
- [[5]](https://github.com/valkey-io/spring-data-valkey) Spring Data Valkey and Spring Boot starter
- [[6]](https://valkey.io/topics/valkey-json/) Valkey JSON module
- [[7]](https://valkey.io/blog/valkey-search-1_2/) Valkey Search 1.2 full-text search announcement
- [[8]](https://github.com/valkey-io/valkey-search) Valkey Search module
- [[9]](https://valkey.io/topics/bloomfilters/) Valkey Bloom filters
- [[10]](https://github.com/valkey-io/valkey-ldap) Valkey LDAP module
- [[11]](https://valkey.io/blog/modern-ai-workloads-mapping-to-valkey/) AI workloads: semantic caching and KV-cache offload
- [[12]](https://valkey.io/commands/incr/) INCR counters and rate-limiter patterns
- [[13]](https://valkey.io/topics/distlock/) Distributed locking and failure assumptions
- [[14]](https://valkey.io/topics/streams-intro/) Streams: append-only-log model, time-series examples, consumer groups
- [[15]](https://valkey.io/topics/pubsub/) Pub/Sub and at-most-once delivery
- [[16]](https://valkey.io/topics/persistence/) Persistence, including append-only file (AOF)
- [[17]](https://valkey.io/) Core structures, including sorted sets
- [[18]](https://github.com/valkey-io) Valkey GitHub organization
- [[19]](https://github.com/valkey-io/assets/blob/main/Valkey%20Branding/valkey_brand_guidelines.pdf) Official brand guide
- [[20]](https://valkey.io/clients/) Client library catalog
- [[21]](https://valkey.io/commands/set/) SET syntax, examples, and EX expiry option
- [[22]](https://valkey.io/topics/introduction/) Valkey introduction: in-memory working dataset and optional disk persistence
- [[23]](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) Cache-aside architecture: application-owned miss, population and invalidation
- [[24]](https://hub.docker.com/v2/repositories/valkey/valkey/tags/alpine) Docker Hub metadata: active alpine tag for valkey/valkey
- [[25]](https://hub.docker.com/v2/repositories/valkey/valkey-alpine/) Requested Docker repository lookup returned 404
- [[26]](https://valkey.io/topics/client-side-caching/) Client-side caching: local-memory access versus network request latency
