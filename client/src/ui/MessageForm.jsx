"use client";

import { useMessages } from "@/providers/MessageContextProvider";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaPaperclip, FaTimes } from "react-icons/fa";

const MessageForm = () => {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const { addMessage } = useMessages();

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile({ file: selectedFile, preview: URL.createObjectURL(selectedFile) });
    }
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() && !file) return; // Prevent sending empty messages

    const formData = new FormData();
    formData.append("prompt", prompt);
    if (file) formData.append("file", file.file);

    addMessage({ role: "user", content: prompt }, formData);

    setPrompt(""); // Clear input
    setFile(null); // Clear file selection
  };

  return (
    <form className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t flex items-center gap-4" onSubmit={handleSubmit}>
      {/* Attach Button */}
      <div className="relative">
        <label className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer">
          <FaPaperclip size={20} />
          <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {/* Input Field */}
      <Textarea
        name="content"
        placeholder="Enter your query here..."
        rows={2}
        value={prompt}
        className="flex-grow p-3 border rounded-lg shadow-sm focus:outline-none"
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* File Preview */}
      {file && (
        <div className="relative flex items-center">
          {file.file.type.startsWith("image") ? (
            <img src={file.preview} alt="Uploaded" className="h-12 w-12 rounded-md object-cover" />
          ) : (
            <span className="text-sm text-gray-700">{file.file.name}</span>
          )}
          <button
            className="ml-2 bg-red-500 text-white p-1 rounded-full"
            onClick={() => setFile(null)}
            type="button"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Send Button */}
      <Button
        type="submit"
        className={cn("px-6 py-2 bg-blue-500 text-white rounded-lg", (!prompt && !file) && "opacity-50 cursor-not-allowed")}
        disabled={!prompt && !file}
      >
        Send➤
      </Button>
    </form>
  );
};

export default MessageForm;