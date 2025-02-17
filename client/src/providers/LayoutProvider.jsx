"use client";

import MessageForm from "@/ui/MessageForm";
import MessagesList from "@/ui/MessageList";

const LayoutProvider = () => (
  <div className="min-h-screen bg-gray-200 flex flex-col">
    <h1 className="text-3xl uppercase font-semibold text-center py-8 bg-blue-500 text-white">
      SRH-AI-ASSISTANT{" "}
    </h1>
    <div className="grid grid-cols-2 flex-1">
      <MessagesList className="border-r-2 bg-gray-50" model="gemini" />
      <MessagesList className="border-l-2 bg-gray-50" />
    </div>
    <MessageForm />
  </div>
);

export default LayoutProvider;