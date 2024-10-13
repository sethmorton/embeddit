// src/app/components/Chat/Messages.tsx
import { Message } from "ai";
import { useRef, useEffect } from "react";
import { marked } from "marked";

export default function Messages({
  messages,
  isCrawlComplete,
}: {
  messages: Message[];
  isCrawlComplete: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to safely render HTML content
  const renderHTML = (html: string) => {
    return { __html: html };
  };

  return (
    <div className="flex-grow overflow-auto">
      <div className="space-y-4 p-4">
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>This is an experimental AI with Bias</span>
        </div>
        {!isCrawlComplete ? (
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Please press the crawl button to start the conversation.
            </span>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.role === "assistant" ? "chat-start" : "chat-end"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  {msg.role === "assistant" ? "🤖" : "🧑‍💻"}
                </div>
              </div>
              <div
                className={`chat-bubble ${
                  msg.role === "assistant"
                    ? "bg-white text-gray-800"
                    : "bg-blue-100 text-gray-800"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={renderHTML(marked(msg.content))}
                />
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
