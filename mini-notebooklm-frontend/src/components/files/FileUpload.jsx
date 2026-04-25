import { FileUp } from "lucide-react";
import { useRef, useState } from "react";

export default function FileUpload({ uploading, progress, onUpload }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    onUpload(event.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={`uploadZone ${dragging ? "isDragging" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.docx,.pptx"
        onChange={(event) => onUpload(event.target.files?.[0])}
        hidden
      />
      <FileUp size={24} />
      <strong>{uploading ? "Indexing document" : "Upload documents"}</strong>
      <p>PDF, TXT, DOCX, PPTX</p>
      {uploading && (
        <div className="progressBar" aria-label="Upload progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
