VALKEY DEMO LIBRARY

ONE REMOTE FOLDER, ONE SERVER
All demos live together in:
  /home/rberoj/valkey-use-cases/demos/

The existing server serves /home/rberoj/valkey-use-cases on remote port 8793.
With the existing laptop port-18793 SSH forward, bookmark:
  http://localhost:18793/demos/

index.html and START_HERE.html are identical menus. Choose a demo to open it
in a new tab. Keep the menu tab and the existing SSH connection open. No
downloads, second server or additional tunnel are needed. All menu links
are relative and use the same server. The original use-case URLs still work.

If the SSH session that owns the server has ended, run this from your laptop:
  ssh -T -L 18793:127.0.0.1:8793 -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 rberoj@dev-dsk-rberoj-2c-cc485d4b.us-west-2.amazon.com '/usr/bin/python3 -u -m http.server 8793 --bind 127.0.0.1 --directory /home/rberoj/valkey-use-cases'
Keep that terminal open. Do not start a second copy while this server runs.

CONTENTS
- 4 load/traffic simulations, including cache on/off and three Sankey labs.
- 8 caching-strategy topics.
- All 20 use cases, including U18 multi-source object caching and U20 LLM
  attention KV tensor caching. Use the player for all 72 scenarios.
- 6 current ValkeyConf diagrams, with their original selectors.
- 3 foundational explainers: in-memory, latency and speed.
- 1 preserved historical 12-scene conference collection.

There are 42 menu entries backed by 7 standalone HTML files. Scene-specific
links select a scene inside its collection; they do not duplicate HTML files.
The optional search filters titles and descriptions. All links still work
with menu JavaScript disabled. Demo playback itself requires JavaScript.

A load simulation is not a real load test. Capacity-lab numbers are synthetic,
not benchmarks or telemetry. Published conference charts retain their source
qualifications. External evidence links require internet when opened.

ORIGINAL FILES
All seven demo HTML files and the supplied SVG/ZIP exports are copied byte
for byte. Their original behavior, exports, references and licenses remain.
ORIGINALS.json records workspace source paths and SHA-256 checksums.
SHA256SUMS.json covers package contents, excluding itself.
Existing source files and the older combined package are not modified. The
preview copy is added in a demos/ subfolder beneath valkey-use-cases/.

MAINTENANCE
Developer build: python3 valkey-demo-library/build.py --publish
This updates the remote menu folder from the source projects. Refresh the
browser after an update; no download or server restart is required. It copies
sources without rebuilding or editing demos. Build and integration tests live
in valkey-demo-library/, outside the served menu folder.

An optional portable ZIP is retained for offline use. Downloading it is not
required for the remote setup. If used, extract the entire ZIP and open
START_HERE.html with animations/, archive/ and downloads/ kept beside it.
