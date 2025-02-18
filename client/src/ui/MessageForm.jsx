"use client";

import { useMessages } from "@/providers/MessageContextProvider";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaPaperclip, FaImage, FaVideo, FaMicrophone } from "react-icons/fa"; // Import icons
import Menu from "./Menu";

const MessageForm = () => {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const { addMessage, speakMessage } = useMessages();

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile({
        file: selectedFile,
        preview: URL.createObjectURL(selectedFile),
      });
    }
    setShowUploadMenu(false); // Hide menu after selection
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    speakMessage("welcome", "de");
    // if (!prompt.trim() && !file) return; // Prevent sending empty messages

    // const formData = new FormData();
    // formData.append("prompt", prompt);
    // if (file) formData.append("file", file.file);

    // addMessage({ role: "user", content: prompt }, formData);

    // setPrompt(""); // Clear input
    // setFile(null); // Clear file selection
  };

  return (
    <form
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t flex items-center gap-4"
      onSubmit={handleSubmit}
    >
      {/* Upload Button with Pop-up Menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowUploadMenu(!showUploadMenu)}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <FaPaperclip size={20} />
        </button>

        {/* Upload Menu */}
        {showUploadMenu && (
          <div className="absolute bottom-12 left-0 bg-white shadow-lg border rounded-lg p-2 flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
              <FaImage /> Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
              <FaVideo /> Video
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
              <FaMicrophone /> Audio
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
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
        <div className="relative">
          <img
            src={file.preview}
            alt="Uploaded"
            className="h-12 w-12 rounded-md object-cover"
          />
          <button
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            onClick={() => setFile(null)}
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      {/* Send Button */}
      <Button
        type="submit"
        className={cn(
          "px-6 py-2 bg-blue-500 text-white rounded-lg",
          !prompt && !file && "opacity-50 cursor-not-allowed"
        )}
        disabled={!prompt && !file}
      >
        Send ➤
      </Button>
    </form>
  );
};

export default MessageForm;
