import { createContext, useContext, useState } from "react";

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState("");

  return (
    <AIContext.Provider value={{ currentQuestion, setCurrentQuestion }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
