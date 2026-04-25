import { useEffect, useId, useState } from "react";

export default function MermaidDiagram({ chart }) {
  const reactId = useId();
  const id = `mermaid-${reactId.replace(/:/g, "")}`;
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function render() {
      if (!chart) return;
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({ startOnLoad: false, theme: "base", securityLevel: "loose" });
        const result = await mermaid.render(id, chart);
        if (!cancelled) {
          setSvg(result.svg);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Mermaid could not render this diagram.");
          setSvg("");
        }
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) return <pre className="codeBlock">{chart}</pre>;
  return <div className="mermaidBox" dangerouslySetInnerHTML={{ __html: svg }} />;
}
