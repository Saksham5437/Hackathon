"""Mini NotebookLM — API smoke tests"""

import requests
import json

BASE = "http://localhost:5000"


def sep(title):
    print("\n" + "=" * 55)
    print(f"  {title}")
    print("=" * 55)


# ── 5. ASK ────────────────────────────────────────────────
sep("5. POST /ask  — What is machine learning?")
r = requests.post(
    f"{BASE}/ask",
    json={"question": "What is machine learning?", "session_id": "test-session"},
)
print(f"Status : {r.status_code}")
d = r.json()
print(f"Answer : {d['answer'][:300]}")
print(f"Sources: {len(d['sources'])} chunk(s)")

# ── 6. FOLLOW-UP (session memory) ────────────────────────
sep("6. POST /ask  — follow-up (session memory test)")
r = requests.post(
    f"{BASE}/ask",
    json={"question": "What did you just tell me about?", "session_id": "test-session"},
)
print(f"Status : {r.status_code}")
d = r.json()
print(f"Answer : {d['answer'][:300]}")

# ── 7. SESSION HISTORY ────────────────────────────────────
sep("7. GET /session/test-session")
r = requests.get(f"{BASE}/session/test-session")
print(f"Status : {r.status_code}")
d = r.json()
print(f"Messages in history: {d['count']}")

# ── 8. SUMMARIZE ──────────────────────────────────────────
sep("8. POST /summarize  — test_ml.txt")
r = requests.post(f"{BASE}/summarize", json={"file_name": "test_ml.txt"})
print(f"Status : {r.status_code}")
d = r.json()
print(f"Summary:\n{d['summary'][:400]}")

# ── 9. CONCEPT MAP (mermaid) ──────────────────────────────
sep("9. POST /concept-map  — mermaid format")
r = requests.post(
    f"{BASE}/concept-map",
    json={"file_name": "test_ml.txt", "output_format": "mermaid"},
)
print(f"Status : {r.status_code}")
d = r.json()
print(f"Format : {d['output_format']}")
print(f"Map:\n{d['concept_map'][:500]}")

# ── 10. CONCEPT MAP (json) ────────────────────────────────
sep("10. POST /concept-map  — json format")
r = requests.post(
    f"{BASE}/concept-map",
    json={"file_name": "test_ml.txt", "output_format": "json"},
)
print(f"Status : {r.status_code}")
d = r.json()
print(f"Format : {d['output_format']}")
print(f"Map:\n{d['concept_map'][:400]}")

# ── 11. VOICE OVERVIEW ────────────────────────────────────
sep("11. POST /voice-overview  — test_ml.txt")
r = requests.post(
    f"{BASE}/voice-overview",
    json={"file_name": "test_ml.txt", "language": "en"},
)
print(f"Status : {r.status_code}")
d = r.json()
print(f"Audio file   : {d.get('audio_file')}")
print(f"Download URL : {d.get('download_url')}")
print(f"Summary text : {d.get('summary_text', '')[:200]}")

# ── 12. DOWNLOAD VOICE OVERVIEW ───────────────────────────
if r.status_code == 200 and d.get("audio_file"):
    audio_file = d["audio_file"]
    sep(f"12. GET /voice-overview/{audio_file}")
    r2 = requests.get(f"{BASE}/voice-overview/{audio_file}")
    print(f"Status       : {r2.status_code}")
    print(f"Content-Type : {r2.headers.get('content-type')}")
    print(f"Size (bytes) : {len(r2.content)}")

# ── 13. DELETE TEST FILE ──────────────────────────────────
sep("13. DELETE /files/test_ml.txt")
r = requests.delete(f"{BASE}/files/test_ml.txt")
print(f"Status : {r.status_code}")
print(json.dumps(r.json(), indent=2))

print("\n\nAll tests complete!")
