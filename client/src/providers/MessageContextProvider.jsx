"use client";

import { chatWithBot, convertToAudio } from "@/api";
import { createContext, useContext, useEffect, useState, useRef } from "react";

const ChatsContext = createContext({});

export function MessagesProvider({ children }) {
  const [gptMessages, setGptMessages] = useState([]);
  const [geminiMessages, setGeminiMessages] = useState([]);

  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const initializeChat = () => {
      const systemMessage = {
        role: "system",
        content: "You are ChatGPT, a large language model trained by OpenAI.",
      };
      const welcomeMessage = {
        role: "assistant",
        content: "Hi, How can I help you today?",
      };
      setGptMessages([systemMessage, welcomeMessage]);
      setGeminiMessages([systemMessage, welcomeMessage]);
    };

    if (!gptMessages?.length) {
      initializeChat();
    }
  }, [gptMessages?.length, geminiMessages?.length, setGptMessages]);

  const addMessage = async (userContent, formData) => {
    setIsLoadingAnswer(true);
    try {
      setGptMessages([...gptMessages, userContent]);
      setGeminiMessages([...geminiMessages, userContent]);

      const { gemini = null, openai = null } = await chatWithBot(formData);
      if (!gemini && !openai) return;

      setGeminiMessages((messages) => [
        ...messages,
        { ...gemini, role: "assistant" },
      ]);

      setGptMessages((messages) => [
        ...messages,
        { ...openai, role: "assistant" },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  const speakMessage = async (message, language) => {
    try {
      const data = await convertToAudio(message, language);
      if (!data) return;

      audioRef.current = new Audio(`data:audio/mpeg;base64,${data.audio}`);
      audioRef.current.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <ChatsContext.Provider
      value={{
        gptMessages,
        geminiMessages,
        addMessage,
        isLoadingAnswer,
        speakMessage,
        stopSpeaking,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(ChatsContext);

  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
};
