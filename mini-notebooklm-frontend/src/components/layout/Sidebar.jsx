import { LogOut, MessageSquarePlus, PanelLeft, Settings } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";
import FileList from "../files/FileList.jsx";
import FileUpload from "../files/FileUpload.jsx";

export default function Sidebar({ filesState, selectedFile, onSelectFile, chat }) {
  const { user, signOut } = useAuth();

  return (
    <aside className="sidebar">
      <Link className="brand" to="/">
        <span className="brandMark">MN</span>
        <span>
          <strong>Mini NotebookLM</strong>
          <small>{user?.username}</small>
        </span>
      </Link>

      <nav className="navTabs">
        <NavLink to="/">
          <PanelLeft size={17} />
          Dashboard
        </NavLink>
        <NavLink to="/settings">
          <Settings size={17} />
          Settings
        </NavLink>
      </nav>

      <FileUpload uploading={filesState.uploading} progress={filesState.uploadProgress} onUpload={filesState.uploadFile} />
      <FileList
        files={filesState.files}
        selectedFile={selectedFile}
        loading={filesState.loading}
        onSelect={onSelectFile}
        onDelete={filesState.deleteFile}
        onRefresh={filesState.refreshFiles}
      />

      <div className="sidebarFooter">
        <Button variant="secondary" onClick={chat.startNewSession}>
          <MessageSquarePlus size={16} />
          New session
        </Button>
        <Button variant="ghost" onClick={chat.clearSession}>Clear memory</Button>
        <Button variant="ghost" onClick={signOut}>
          <LogOut size={16} />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
