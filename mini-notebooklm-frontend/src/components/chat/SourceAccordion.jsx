export default function SourceAccordion({ sources = [] }) {
  if (!sources.length) return null;

  const uniqueSources = [...new Set(sources.map((source) => source.source).filter(Boolean))];

  return (
    <div className="sourceMeta" title={`${sources.length} retrieved passages`}>
      Sources used: {uniqueSources.join(", ")}
    </div>
  );
}
