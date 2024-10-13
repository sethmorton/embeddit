// Page.tsx
"use client";
import React, { useEffect, useRef, useState, FormEvent } from "react";
import { Context } from "@/components/Context";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import { useChat } from "ai/react";
import InstructionModal from "./components/InstructionModal";
import { AiFillGithub, AiOutlineInfoCircle } from "react-icons/ai";
import { ErrorProvider } from "./components/Error/ErrorContext";

const Page: React.FC = () => {
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [subreddit, setSubreddit] = useState("sibo");
  const [isCrawlComplete, setIsCrawlComplete] = useState(false);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: async () => {
      setGotMessages(true);
    },
  });

  const prevMessagesLengthRef = useRef(messages.length);

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
  };

  useEffect(() => {
    const getContext = async () => {
      const response = await fetch("/api/context", {
        method: "POST",
        body: JSON.stringify({ messages }),
      });
      const { context } = await response.json();
      setContext(context.map((c: any) => c.id));
    };
    if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
      getContext();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, gotMessages]);

  return (
    <ErrorProvider>
      <div className="flex flex-col min-h-screen">
        <Header className="bg-base-100 shadow-sm py-2" />

        <main className="flex-grow flex overflow-hidden bg-base-100 p-4 h-[calc(100vh-64px)]">
          <div className="flex-1 flex flex-col mr-4">
            <div className="card bg-base-200 shadow-xl flex-grow flex flex-col h-full">
              <div className="card-body flex-grow overflow-hidden">
                <Chat
                  input={input}
                  handleInputChange={handleInputChange}
                  handleMessageSubmit={handleMessageSubmit}
                  messages={messages}
                  isCrawlComplete={isCrawlComplete}
                />
              </div>
            </div>
          </div>

          <div className="w-1/3 overflow-auto">
            <Context
              className="h-full"
              selected={context}
              onCrawlComplete={setIsCrawlComplete}
            />
          </div>
        </main>

        <div className="btm-nav">
          <button
            className="text-primary"
            onClick={() =>
              window.open(
                "https://github.com/pinecone-io/pinecone-vercel-starter",
                "_blank"
              )
            }
          >
            <AiFillGithub className="h-5 w-5" />
          </button>
          <button className="text-primary" onClick={() => setModalOpen(true)}>
            <AiOutlineInfoCircle className="h-5 w-5" />
          </button>
        </div>
      </div>

      <InstructionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </ErrorProvider>
  );
};

export default Page;
