"use client";

import { useMessages } from "@/providers/MessageContextProvider";
import Bubble from "./Bubble";

const MessagesList = ({ model = "gpt", className = "" }) => {
  const { geminiMessages, gptMessages, isLoadingAnswer } = useMessages();

  const messages = model === "gpt" ? gptMessages : geminiMessages;

  return (
    <div className={`flex flex-col justify-end gap-2 ${className} p-8 mb-28`}>
      {messages?.map((message, i) => {
        const isUser = message.role === "user";
        if (message.role === "system") return null;
        return (
          <div
            id={`message-${i}`}
            className={`fade-up mb-4 flex ${
              isUser ? "justify-end" : "justify-start"
            } ${i === 1 ? "max-w-md" : ""}`}
            key={message.content + i}
          >
            {isUser ? (
              <>
                <div
                  style={{ maxWidth: "calc(100% - 45px)" }}
                  className={`group relative rounded-lg px-3 py-2 bg-orange-600 mr-2 text-gray-50`}
                >
                  {message.content?.trim() ?? ""}
                </div>
                <img
                  src="https://www.teamsmart.ai/next-assets/team/ai.jpg"
                  className="h-9 w-9 rounded-full"
                  alt="avatar"
                />
              </>
            ) : (
              <Bubble message={message} model={model} />
            )}
          </div>
        );
      })}

      {isLoadingAnswer && (
        <div className="mb-4 flex justify-start">
          <img
            src="https://www.teamsmart.ai/next-assets/team/ai.jpg"
            className="h-9 w-9 rounded-full"
            alt="avatar"
          />
          <div className="loader relative ml-2 flex items-center justify-between space-x-1.5 rounded-full bg-gray-200 p-2.5 px-4 dark:bg-gray-800">
            <span className="block h-3 w-3 rounded-full"></span>
            <span className="block h-3 w-3 rounded-full"></span>
            <span className="block h-3 w-3 rounded-full"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesList;