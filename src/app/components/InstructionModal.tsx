import React from "react";
import { AiFillGithub } from "react-icons/ai";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionModal: React.FC<InstructionModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-base-200 p-5 z-50 rounded-lg shadow-lg relative w-8/12 md:w-5/12">
        <button
          onClick={onClose}
          className="absolute right-2 text-3xl top-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <p>
          This chatbot demonstrates a RAG (Retrieval-Augmented Generation)
          pattern using{" "}
          <a
            href="https://pinecone.io"
            target="_blank"
            className="text-primary"
          >
            Pinecone
          </a>{" "}
          and Next.js. The bot is designed to provide information about SIBO
          (Small Intestinal Bacterial Overgrowth).
        </p>
        <br />
        <p>
          In the context panel on the right (or below on mobile devices), you
          can see Reddit posts from the r/SIBO subreddit. These posts are
          indexed in Pinecone to provide relevant context for the chatbot's
          responses.
        </p>
        <br />
        <p>
          You can ask the chatbot questions about SIBO, and it will use the
          indexed Reddit posts to provide informed answers. The relevant context
          used for each response will be highlighted in the context panel.
        </p>
        <br />
        <p>
          The chat interface allows you to have a conversation about SIBO, with
          each of your messages and the bot's responses displayed in the chat
          window.
        </p>
        <br />
        <p>
          For more information about this project, you can click the GitHub icon
          at the bottom of the page to view the source code.
        </p>
      </div>
      <div
        className="absolute inset-0 bg-black z-20 opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default InstructionModal;
