import { Activity, AudioLines, FileText, Loader2, Map, PlayCircle, Search } from "lucide-react";
import { useState } from "react";
import { api } from "../../services/api.js";
import { isMermaid } from "../../utils/formatters.js";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import MermaidDiagram from "../ui/MermaidDiagram.jsx";

export default function UtilityPanel({ tools, selectedFile }) {
  const [topic, setTopic] = useState("");
  const selectedLabel = selectedFile?.file_name || "All documents";

  return (
    <aside className="utilityPanel">
      <div className="utilityIntro">
        <span className={`healthDot ${tools.health?.status === "ok" ? "online" : "offline"}`} />
        <div>
          <strong>{tools.health?.status === "ok" ? "Backend online" : "Backend offline"}</strong>
          <small>{tools.health?.provider || "unknown"} · {tools.health?.uploaded_files || 0} files</small>
        </div>
        <Activity size={18} />
      </div>

      <Card
        title="Summary"
        action={
          <Button variant="secondary" size="sm" onClick={tools.generateSummary} disabled={tools.loadingKey === "Summary"}>
            {tools.loadingKey === "Summary" ? <Loader2 className="spin" size={15} /> : <FileText size={15} />}
            Generate
          </Button>
        }
      >
        <p className="muted">{tools.summary?.summary || `Create a concise summary for ${selectedLabel}.`}</p>
      </Card>

      <Card
        title="Concept map"
        action={
          <Button variant="secondary" size="sm" onClick={tools.generateConceptMap} disabled={tools.loadingKey === "Concept map"}>
            {tools.loadingKey === "Concept map" ? <Loader2 className="spin" size={15} /> : <Map size={15} />}
            Map
          </Button>
        }
      >
        {tools.conceptMap?.concept_map ? (
          isMermaid(tools.conceptMap.concept_map) ? (
            <MermaidDiagram chart={tools.conceptMap.concept_map} />
          ) : (
            <pre className="codeBlock">{tools.conceptMap.concept_map}</pre>
          )
        ) : (
          <p className="muted">Generate a Mermaid mindmap from the active document scope.</p>
        )}
      </Card>

      <Card
        title="Voice overview"
        action={
          <Button variant="secondary" size="sm" onClick={tools.generateVoice} disabled={tools.loadingKey === "Voice overview"}>
            {tools.loadingKey === "Voice overview" ? <Loader2 className="spin" size={15} /> : <AudioLines size={15} />}
            Audio
          </Button>
        }
      >
        {tools.voice?.audio_file ? (
          <div className="voiceBox">
            <audio controls autoPlay src={api.voiceUrl(tools.voice.download_url || tools.voice.audio_file)} />
            <p>{tools.voice.summary_text}</p>
          </div>
        ) : (
          <p className="muted">Generate a short MP3 overview with the backend voice endpoint.</p>
        )}
      </Card>

      <Card title="Learning videos">
        <form
          className="videoSearch"
          onSubmit={(event) => {
            event.preventDefault();
            tools.findVideos(topic);
          }}
        >
          <input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Optional topic" />
          <Button type="submit" variant="secondary" size="icon" disabled={tools.loadingKey === "YouTube"} title="Find videos">
            {tools.loadingKey === "YouTube" ? <Loader2 className="spin" size={15} /> : <Search size={15} />}
          </Button>
        </form>
        {tools.videos?.videos?.length ? (
          <div className="videoList">
            {tools.videos.videos.map((video) => (
              <a key={video.url} href={video.url} target="_blank" rel="noreferrer">
                {video.thumbnail && <img src={video.thumbnail} alt="" />}
                <span>
                  <strong>{video.title}</strong>
                  <small>{video.channel} · {video.duration_label}</small>
                </span>
                <PlayCircle size={16} />
              </a>
            ))}
          </div>
        ) : (
          <p className="muted">Find YouTube recommendations by topic or document content.</p>
        )}
      </Card>
    </aside>
  );
}
