"""Offline editorial checks only; no rendering, network calls, or file mutations."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TIMELINE = json.loads((ROOT / "TIMELINE.json").read_text())
LOGOS = json.loads((ROOT / "PARTICIPANT_LOGOS.json").read_text())
SCRIPT = (ROOT / "SCRIPT.md").read_text()
NARRATION = (ROOT / "NARRATION.txt").read_text().strip().split("\n\n")
SCENES = {s["key"]: s for s in TIMELINE["scenes"]}
EXPECTED_SCENES = [
    ("memory-vs-disk", 0, 8), ("definition", 8, 27),
    ("set-example", 27, 35), ("cache-aside", 35, 53),
    ("releases", 53, 57), ("modules", 57, 62),
    ("integrations", 62, 66), ("use-cases-state", 66, 71),
    ("use-cases-coordination", 71, 76), ("use-cases-ordered", 76, 81),
    ("use-cases-ai", 81, 88), ("semantic-cache", 88, 106),
    ("participants", 106, 112), ("docker-quickstart", 112, 120),
]


def timecode(seconds):
    return f"{seconds // 60:02d}:{seconds % 60:02d}"

DEFINITION = (
    "Valkey is an open source (BSD) high-performance key/value datastore that supports "
    "a variety of workloads such as caching, message queues, and can act as a primary "
    "database. The project is backed by the Linux Foundation, ensuring it will remain "
    "open source forever."
)
EXPECTED_LABELS = {
    1: "Cache", 2: "Sessions", 3: "Distributed locks", 4: "Counters",
    5: "Rate limiter", 6: "Global IDs", 7: "Message queue",
    8: "Rank / leaderboard", 9: "Time-series", 10: "Chats / Pub/Sub",
    11: "Idempotency", 12: "Append-only log", 13: "Microservices",
    14: "Document database / JSON", 15: "Full-text search engine",
    16: "Vector database", 17: "Probabilistic membership",
    18: "LLM KV cache offload", 19: "Semantic cache",
}
EXPECTED_PARTICIPANTS = {
    "Aiven", "Alibaba Cloud", "Amazon Web Services", "anynines", "BetterDB",
    "ByteDance", "DigitalOcean", "Ericsson", "Freshworks", "Google Cloud",
    "Heroku - Salesforce", "IONOS Cloud", "k0rdent", "Momento",
    "NetApp Instaclustr", "Oracle Cloud Infrastructure", "Percona", "Solanica",
    "Tencent Cloud", "UpCloud", "Vultr",
}


class BriefChecks(unittest.TestCase):
    def test_runtime_and_continuity(self):
        scenes = TIMELINE["scenes"]
        self.assertEqual(len(scenes), 14)
        self.assertEqual([(s["key"], s["start"], s["end"]) for s in scenes], EXPECTED_SCENES)
        self.assertEqual(scenes[0]["start"], 0)
        self.assertEqual(scenes[-1]["end"], 120)
        self.assertEqual(TIMELINE["duration_seconds"], 120)
        self.assertEqual(TIMELINE["fps"], 30)
        self.assertEqual(sum((s["end"] - s["start"]) * 30 for s in scenes), 3600)
        for i, s in enumerate(scenes):
            self.assertGreater(s["end"], s["start"])
            self.assertEqual(s["id"], i + 1)
            if i:
                self.assertEqual(scenes[i - 1]["end"], s["start"])

    def test_definition_and_narration_parity(self):
        self.assertEqual(TIMELINE["required_definition"], DEFINITION)
        self.assertEqual(SCENES["definition"]["narration"], DEFINITION)
        self.assertEqual(NARRATION, [s["narration"] for s in TIMELINE["scenes"]])
        self.assertEqual(re.findall(r'\*\*Voiceover:\*\* “([^”]+)”', SCRIPT), NARRATION)
        word_count = sum(len(n.split()) for n in NARRATION)
        self.assertIn(f"{word_count} whitespace-delimited words", SCRIPT)
        self.assertEqual(word_count, 229)
        for scene in TIMELINE["scenes"]:
            planned_wpm = len(scene["narration"].split()) * 60 / (scene["end"] - scene["start"])
            self.assertLessEqual(planned_wpm, 160, scene["key"])

    def test_all_use_cases_explicitly_visible(self):
        ids = [n for s in TIMELINE["scenes"] for n in s["use_case_ids"]]
        self.assertEqual(sorted(ids), list(range(1, 20)))
        matrix = (ROOT / "USE_CASES.md").read_text()
        for s in TIMELINE["scenes"]:
            for n in s["use_case_ids"]:
                self.assertTrue(any(EXPECTED_LABELS[n] in t for t in s["screen"]), (n, s["id"]))
                self.assertIn(f"| {n} | {EXPECTED_LABELS[n]} | {s['id']} |", matrix)
            for label in s["screen"]:
                self.assertIn(label, SCRIPT)

    def test_modules_and_integrations(self):
        modules = " ".join(SCENES["modules"]["screen"])
        for required in ["valkey-json", "valkey-search", "valkey-bloom", "valkey-ldap"]:
            self.assertIn(required, modules)
        integrations = " ".join(SCENES["integrations"]["screen"])
        for required in ["Valkey GLIDE", "Spring Boot", "Fastify", "Powertools for AWS Lambda"]:
            self.assertIn(required, integrations)

    def test_releases_and_preview_label(self):
        releases = TIMELINE["releases"]
        self.assertEqual({r["version"] for r in releases}, {"9.1.2", "8.1.10", "7.2.14", "9.2.0-rc1"})
        for release in releases:
            if "-rc" in release["version"]:
                self.assertEqual(release["status"], "preview")
                self.assertIn(f"Preview: {release['version']}", SCENES["releases"]["screen"])
        self.assertIn("As of 2026-10-02", SCENES["releases"]["screen"])

    def test_sources(self):
        sources = TIMELINE["sources"]
        for s in TIMELINE["scenes"]:
            self.assertTrue(s["source_ids"])
            for source_id in s["source_ids"]:
                self.assertIn(str(source_id), sources)
        for path in ROOT.glob("*.md"):
            if path.name == "LOGOS.md":
                continue
            for source_id, url in re.findall(r'\[\[(\d+)\]\]\(([^)]+)\)', path.read_text()):
                self.assertEqual(sources[source_id]["url"], url, str(path))

    def test_script_timeline_parity(self):
        headings = re.findall(r"^### Scene (\d+): (\d{2}:\d{2})–(\d{2}:\d{2}) \| (.+)$", SCRIPT, re.M)
        self.assertEqual(headings, [
            (str(s["id"]), timecode(s["start"]), timecode(s["end"]), s["title"])
            for s in TIMELINE["scenes"]
        ])
        blocks = re.split(r"^### Scene ", SCRIPT, flags=re.M)[1:]
        for scene, block in zip(TIMELINE["scenes"], blocks):
            with self.subTest(scene=scene["key"]):
                self.assertIn("**On screen:** " + "; ".join(scene["screen"]), block)
                self.assertIn("**Motion and composition:** " + scene["direction"], block)
                self.assertIn("**Voiceover:** “" + scene["narration"] + "”", block)
                for beat in scene.get("beats", []):
                    label = beat["event"].replace("_", " ")
                    self.assertIn(f"- {beat['local_start']}–{beat['local_end']}s: {label}.", block)
                for source_id in scene["source_ids"]:
                    url = TIMELINE["sources"][str(source_id)]["url"]
                    self.assertIn(f"[[{source_id}]]({url})", block)

    def test_memory_opening(self):
        opening = TIMELINE["scenes"][0]
        self.assertEqual(opening["key"], "memory-vs-disk")
        for label in ["MEMORY vs DISK", "RAM: working data", "Disk: persistent storage",
                      "Conceptual comparison, not a benchmark"]:
            self.assertIn(label, opening["screen"])
        self.assertIn("optional disk persistence", opening["narration"])
        self.assertIn("networked Valkey as local RAM speed", opening["direction"])
        self.assertNotRegex(" ".join(opening["screen"]), r"\d+\s*(?:x|×|ns|ms|%)")

    def test_set_example(self):
        example = SCENES["set-example"]
        self.assertEqual(example["code_example"]["lines"], [
            "valkey> SET Key Value", "OK", "valkey> GET Key", '\"Value\"'
        ])
        self.assertIn("not executed", example["code_example"]["status"])
        self.assertIn("No TTL is implied", example["direction"])
        for line in example["code_example"]["lines"]:
            self.assertIn(line, SCRIPT)

    def test_walkthrough_beat_coverage(self):
        expected_events = {
            "cache-aside": ["app_cache_lookup_and_miss", "app_reads_primary_database",
                            "app_populates_cache_with_expiry_and_returns",
                            "next_request_cache_hit_skips_database"],
            "semantic-cache": ["embed_prompt_externally", "scoped_vector_similarity_lookup",
                               "validate_threshold_context_freshness_then_hit",
                               "miss_calls_model_then_caches_response_and_embedding"],
        }
        for key, events in expected_events.items():
            scene = SCENES[key]
            beats = scene["beats"]
            self.assertEqual([b["event"] for b in beats], events)
            self.assertEqual(beats[0]["local_start"], 0)
            self.assertEqual(beats[-1]["local_end"], scene["end"] - scene["start"])
            for i, beat in enumerate(beats):
                self.assertGreater(beat["local_end"], beat["local_start"])
                if i:
                    self.assertEqual(beats[i - 1]["local_end"], beat["local_start"])

    def test_cache_aside_application_ownership(self):
        scene = SCENES["cache-aside"]
        self.assertEqual(scene["focus_use_case_ids"], [1])
        self.assertEqual(scene["cache_fill_command"], 'SET product:42 "blue mug" EX 60')
        for label in ["1. Check cache", "2. Miss: read database",
                      "3. Populate cache + expiry", "4. Next hit: skip database",
                      "Write path: update database, then invalidate cache"]:
            self.assertIn(label, scene["screen"])
        self.assertIn("Never draw Valkey fetching the database on a miss", scene["direction"])
        self.assertIn("do not guarantee consistency under races", scene["direction"])
        self.assertIn(scene["cache_fill_command"], SCRIPT)

    def test_semantic_cache_validation_and_fallback(self):
        scene = SCENES["semantic-cache"]
        self.assertEqual(scene["focus_use_case_ids"], [19])
        for label in ["Prompt → embedding", "Valkey Search: vector similarity",
                      "Close match + valid context + fresh answer?",
                      "Hit: reuse cached answer",
                      "Miss: call model → cache answer + embedding",
                      "Same scope · compatible model/context · expiry"]:
            self.assertIn(label, scene["screen"])
        self.assertIn("Keep both embedding and language models outside Valkey", scene["direction"])
        self.assertIn("Do not reuse private answers across users or tenants", scene["direction"])

    def test_docker_final_frame_and_correction(self):
        scene = TIMELINE["scenes"][-1]
        command = "docker run --rm valkey/valkey:alpine"
        self.assertEqual(scene["key"], "docker-quickstart")
        self.assertEqual(scene["shell_command"], command)
        self.assertIn(command, scene["screen"])
        self.assertIn("Core server · Docker required", scene["screen"])
        self.assertIn("through the final frame", scene["direction"])
        self.assertIn("No published host port or persistent volume", scene["direction"])
        correction = TIMELINE["docker_command_correction"]
        self.assertEqual(correction["requested"], "docker run --rm valkey/valkey-alpine")
        self.assertEqual(correction["used"], command)
        self.assertIn("No container was run", correction["reason"])
        for s in TIMELINE["scenes"]:
            self.assertNotIn(correction["requested"], " ".join(s["screen"]))
        self.assertIn(f"```bash\n{command}\n```", SCRIPT)

    def test_companion_scene_references(self):
        matrix = (ROOT / "USE_CASES.md").read_text()
        for key in ["cache-aside", "semantic-cache", "set-example"]:
            s = SCENES[key]
            self.assertIn(f"Scene {s['id']}, {timecode(s['start'])}–{timecode(s['end'])}", matrix)
        participants = SCENES["participants"]
        logos_plan = (ROOT / "LOGOS.md").read_text()
        self.assertIn(
            f"Scene {participants['id']}, {timecode(participants['start'])}–{timecode(participants['end'])}",
            logos_plan,
        )
        self.assertEqual(participants["end"], SCENES["docker-quickstart"]["start"])
        self.assertIn("120-second revision", (ROOT / "RESEARCH.md").read_text())
        self.assertIn("120 seconds", SCRIPT)
        self.assertIn("3,600 frames across 14 scenes", SCRIPT)

    def test_participant_allowlist(self):
        logos = LOGOS["logos"]
        self.assertEqual(len(logos), 21)
        self.assertEqual({l["name"] for l in logos}, EXPECTED_PARTICIPANTS)
        self.assertEqual([l["name"] for l in logos], sorted(EXPECTED_PARTICIPANTS, key=str.casefold))
        self.assertEqual(len({l["url"] for l in logos}), 21)
        self.assertEqual({(l["grid_row"], l["grid_column"]) for l in logos},
                         {(r, c) for r in range(1, 4) for c in range(1, 8)})
        self.assertIn("Apple", LOGOS["excluded"])
        self.assertIn("Apple", TIMELINE["excluded_participant_names"])
        for logo in logos:
            self.assertNotIn("apple", (logo["name"] + logo["url"]).casefold())
            self.assertTrue(logo["url"].startswith("https://valkey.io/img/"))
            self.assertEqual(logo["http_status_checked"], 200)
            self.assertIn(logo["url"], (ROOT / "LOGOS.md").read_text())
        for scene in TIMELINE["scenes"]:
            self.assertNotIn("apple", " ".join(scene["screen"]).casefold())
            self.assertNotIn("apple", scene["narration"].casefold())


if __name__ == "__main__":
    unittest.main(verbosity=2)
