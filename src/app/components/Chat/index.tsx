// Chat.tsx
import React, { FormEvent, ChangeEvent } from "react";
import Messages from "./Messages";
import { Message } from "ai/react";
import { Send } from "lucide-react";

interface ChatProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  messages: Message[];
  isCrawlComplete: boolean;
}

const Chat: React.FC<ChatProps> = ({
  input,
  handleInputChange,
  handleMessageSubmit,
  messages,
  isCrawlComplete,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <Messages messages={messages} isCrawlComplete={isCrawlComplete} />
      </div>
      <div className="p-4 bg-base-200 mb-4">
        <form onSubmit={handleMessageSubmit} className="flex">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="input input-bordered flex-grow mr-2"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isCrawlComplete}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
