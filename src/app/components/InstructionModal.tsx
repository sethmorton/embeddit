import React from "react";

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
      <div className="bg-base-200 p-5 z-50 rounded-lg shadow-lg relative w-11/12 max-w-2xl">
        <button
          onClick={onClose}
          className="absolute right-2 text-3xl top-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            This chatbot demonstrates a RAG pattern using Pinecone and Next.js.
          </li>
          <li>
            It provides information about SIBO (Small Intestinal Bacterial
            Overgrowth).
          </li>
          <li>The context panel shows indexed Reddit posts from r/SIBO.</li>
          <li>Ask questions about SIBO to get informed answers.</li>
          <li>Relevant context is highlighted in the context panel.</li>
          <li>The chat interface allows for a conversation about SIBO.</li>
          <li>Click the GitHub icon at the bottom for the source code.</li>
        </ul>
      </div>
      <div
        className="absolute inset-0 bg-black z-20 opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default InstructionModal;
