# Shared direction for the Valkey recording series

Applies to the four new scripts and future production of the existing 9.2 script.

## The screen teaches one idea

Begin each shot with the state the viewer needs to understand. Introduce the operation, animate its state change, and hold the result. A technical explanation can take several shots; it does not need to fit into one complete diagram.

Use:

- One short headline, usually three to six words.
- Node labels of one to three words.
- At most four main nodes, with an occasional fifth for shared-session routing.
- One active arrow or request at a time.
- One changing value or counter per shot.
- A two-second hold after an important output.

Keep command demonstrations full screen. The normal maximum is one command and its reply. A transaction can reveal queued commands sequentially, then show EXEC's result. Full Lua bodies, vector schemas, metadata lists, and source URLs belong in companion notes.

## Consistent visual language

Use the Valkey colors and fonts in the local library. Retain component positions while comparing approaches. Show activity through a moving request dot and a highlighted edge; keep inactive components dim. Use a warm warning color for waiting or rejected work and clear text labels as well as color.

Use simple cuts between concepts and short fades when the same diagram changes state. Motion should show direction, ownership, or a state transition. Avoid continuous decorative movement behind a command or narration.

Captions are an accessibility layer. Place short phrase captions below the diagram without duplicating the entire explanatory paragraph.

## Reference-to-shot mapping

| Video | Library scenes | What to reuse |
|---|---|---|
| What is Valkey | C12, C01, U18, in-memory explainer | Peak pressure, cache miss/hit, memory working data |
| Top five use cases | U01, U02, U07, U08, U05 | Query result, shared session, pending job, rank update, shared budget |
| Query and semantic caching | U01, U19, U16 | Exact result reuse, exact-before-semantic path, candidate validation |
| Caching strategies | C01, C03, C02, C04, C08, C11 | Read, invalidate, coordinate, defer, acknowledgement point, finite buffer |

## Recording from the library

Open the relevant HTML file, select the scene, and choose the scenario named by the script. Use the step controls to inspect the exact transition. Presenter view or exported SVGs can provide source frames.

Crop or reconstruct only the diagram region for video. The library's explanatory panel, resource gauges, navigation, and controls are useful during preparation. They make the recorded shot too dense when shown together.

Synthetic traffic controls are teaching models. Any numbers taken from those controls must remain labelled illustrative. Real latency, throughput, hit rate, token count, or cost comes from the actual recorded workload.

## Hooks and claims

Use the viewer's problem in the first line: peak capacity, repeated queries, session routing, background work, or token spend. Resolve it by the second scene through a visible mechanism.

Use a measured number only with its workload and baseline. A worked arithmetic example may use a number when its assumptions are visible. The semantic-caching script's 100 → 50 generation-call example is one such illustration; it does not imply a 50% reduction in every model bill.

## Runtime and delivery

The introduction is planned for 1:55. The other three episodes are planned for 5:00. Scene timing includes diagram holds and command output. Read the narration aloud at roughly 130–150 words per minute before recording. Adjust holds to the recorded voice instead of increasing the speech rate to fit.

Deliverables in this task are the recording scripts and animation direction. Rendered animations, executed application demos, and measured narration timing remain production work.
