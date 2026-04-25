import { useState } from "react";
import ChatPanel from "../components/chat/ChatPanel.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import UtilityPanel from "../components/layout/UtilityPanel.jsx";
import { useChat } from "../hooks/useChat.js";
import { useFiles } from "../hooks/useFiles.js";
import { useNotebookTools } from "../hooks/useNotebookTools.js";

export default function DashboardPage() {
  const filesState = useFiles();
  const chat = useChat();
  const [selectedFile, setSelectedFile] = useState(null);
  const tools = useNotebookTools(selectedFile);

  return (
    <div className="appShell">
      <Sidebar filesState={filesState} selectedFile={selectedFile} onSelectFile={setSelectedFile} chat={chat} />
      <ChatPanel chat={chat} selectedFile={selectedFile} />
      <UtilityPanel tools={tools} selectedFile={selectedFile} />
    </div>
  );
}
