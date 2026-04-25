import { Bot, Loader2, Send } from "lucide-react";
import { useEffect, useRef } from "react";
import Button from "../ui/Button.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import ChatMessage from "./ChatMessage.jsx";

export default function ChatPanel({ chat, selectedFile }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, chat.asking]);

  const submit = (event) => {
    event.preventDefault();
    chat.askQuestion(chat.draft, selectedFile?.file_name || null);
  };

  return (
    <main className="centerPanel">
      <div className="chatHeader">
        <div>
          <span className="eyebrow">{selectedFile?.file_name || "All documents"}</span>
          <h1>Ask your notebook</h1>
        </div>
        <span className="sessionPill">{chat.sessionId}</span>
      </div>

      <div className="chatScroll">
        {chat.historyLoading ? (
          <EmptyState icon={Loader2} title="Loading session" message="Restoring your recent conversation memory." />
        ) : !chat.messages.length ? (
          <EmptyState icon={Bot} title="Ready when you are" message="Ask about uploaded documents, request comparisons, or explore a source." />
        ) : (
          chat.messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}
        {chat.asking && (
          <div className="typingState">
            <Loader2 size={18} className="spin" />
            Aura is reading your notebook
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form className="composer" onSubmit={submit}>
        <textarea
          value={chat.draft}
          onChange={(event) => chat.setDraft(event.target.value)}
          placeholder="Ask a question about your documents..."
          rows={1}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit(event);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={chat.asking || !chat.draft.trim()} title="Send question">
          <Send size={18} />
        </Button>
      </form>
    </main>
  );
}
