import React from "react";
import { useError } from "./ErrorContext";

const ErrorOverlay: React.FC = () => {
  const { error, setError } = useError();

  if (!error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">An error occurred</h2>
        <p className="mb-4">{error}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setError(null)}
        >
          Close
        </button>
      </div>
    </div>
  );
};
