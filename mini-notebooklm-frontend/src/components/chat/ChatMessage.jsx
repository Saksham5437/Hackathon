import { Check, Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Button from "../ui/Button.jsx";
import SourceAccordion from "./SourceAccordion.jsx";

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className={`chatMessage ${isAssistant ? "assistant" : "user"} ${message.isError ? "error" : ""}`}>
      <div className="messageAvatar">{isAssistant ? "A" : "You"}</div>
      <div className="messageBody">
        <div className="messageContent">
          {isAssistant ? <ReactMarkdown>{message.content}</ReactMarkdown> : <p>{message.content}</p>}
        </div>
        {isAssistant && (
          <div className="messageActions">
            <SourceAccordion sources={message.sources} />
            <Button variant="ghost" size="sm" onClick={copy}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
