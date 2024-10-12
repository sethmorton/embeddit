import React, { createContext, useState, useContext, ReactNode } from "react";

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
}

// Create the context with a default value
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// ErrorProvider component
export const ErrorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<string | null>(null);

  const value = React.useMemo(() => ({ error, setError }), [error]);

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};

// Custom hook for using the error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
