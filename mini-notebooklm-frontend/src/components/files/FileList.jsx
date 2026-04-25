import { FileText, RefreshCw, Trash2 } from "lucide-react";
import Button from "../ui/Button.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import { formatBytes, formatDate } from "../../utils/formatters.js";

export default function FileList({ files, selectedFile, loading, onSelect, onDelete, onRefresh }) {
  return (
    <div className="fileListBlock">
      <div className="miniHeader">
        <span>Library</span>
        <Button variant="ghost" size="icon" onClick={onRefresh} title="Refresh files">
          <RefreshCw size={16} className={loading ? "spin" : ""} />
        </Button>
      </div>
      {!files.length ? (
        <EmptyState icon={FileText} title="No files yet" message="Upload a document to unlock chat, summaries, maps, and audio." />
      ) : (
        <div className="fileList">
          <button className={!selectedFile ? "fileItem active" : "fileItem"} onClick={() => onSelect(null)} type="button">
            <FileText size={18} />
            <span>
              <strong>All documents</strong>
              <small>{files.length} files</small>
            </span>
          </button>
          {files.map((file) => (
            <div className={selectedFile?.file_name === file.file_name ? "fileItem active" : "fileItem"} key={file.file_name}>
              <button type="button" onClick={() => onSelect(file)}>
                <FileText size={18} />
                <span>
                  <strong>{file.file_name}</strong>
                  <small>{formatBytes(file.size_bytes)} · {formatDate(file.uploaded_at)}</small>
                </span>
              </button>
              <Button variant="ghost" size="icon" title={`Delete ${file.file_name}`} onClick={() => onDelete(file.file_name)}>
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
