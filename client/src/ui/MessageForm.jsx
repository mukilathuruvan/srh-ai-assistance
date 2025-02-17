"use client";

import { useMessages } from "@/providers/MessageContextProvider";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Menu from "./Menu";

const MessageForm = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const audioRef = useRef(null);
  const { addMessage } = useMessages();

  const handleImageChange = (e) => {
    console.log("Image changed:", e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleAudioChange = (e) => {
    setAudio(e.target.files[0]);
  };

  const handleAudioRecord = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          recorder.start();

          const chunks = [];
          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/wav" }); // Or appropriate type
            setAudio(blob);
          };

          audioRef.current.onclick = () => {
            recorder.stop();
            audioRef.current.onclick = handleAudioRecord; // Reset onclick
            audioRef.current.textContent = "Record Audio";
          };
          audioRef.current.onclick(); // Stop Recording
          audioRef.current.textContent = "Stop Recording";
        })
        .catch((err) => console.error("Error accessing microphone:", err));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("prompt", prompt);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);
    if (audio) formData.append("audio", audio);

    try {
      addMessage({ role: "user", content: prompt }, formData);

      setPrompt("");
      setImage(null);
      setVideo(null);
      setAudio(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <form
      className="fixed bottom-0 left-0 right-0 z-10 bg-gray-200 shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="supports-backdrop-blur:bg-white/95 h-[130px] max-w-4xl mx-auto rounded-xl p-5 backdrop-blur">
        {/* <span className="absolute bg-transparent text-sm left-5 top-1">
          {image && <span className="text-green-500">{image.f}</span>}
        </span> */}

        <Textarea
          name="content"
          placeholder="Enter your query here..."
          rows={3}
          value={prompt}
          autoFocus
          className="border-0 !p-3 text-gray-900 shadow-none ring-1 ring-gray-300/40 backdrop-blur focus:outline-none focus:ring-gray-300/80 dark:bg-gray-800/80 dark:text-white dark:placeholder-gray-400 dark:ring-0"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="absolute top-9 bottom-0 right-8">
          <div className="flex w-full justify-end gap-6">
            <Menu
              handleImageChange={handleImageChange}
              handleVideoChange={handleVideoChange}
              handleAudioChange={handleAudioChange}
            />

            <Button
              color="secondary"
              className={cn(
                "px-8 py-4",
                !prompt.length && "opacity-50 cursor-not-allowed"
              )}
              type="submit"
              size="small"
              disabled={!prompt}
            >
              Send
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-1 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MessageForm;