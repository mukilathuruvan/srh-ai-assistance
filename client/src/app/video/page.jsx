"use client";

import { processVideo } from "@/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const VideoPage = () => {
  const [response, setResponse] = useState(null);

  const onVideoChoose = async (url) => {
    const res = await processVideo(url);
    if (res) setResponse(res.data);
  };

  if (response) {
    return (
      <>
        <Button onClick={() => setResponse(null)}>Back</Button>
        <ul>
          {response.map((item, index) => (
            <li key={index}>
              <ul>
                {item.attributes.map((item, index) => (
                  <li key={index} className="my-4">
                    {Object.entries(item).map(([key, value]) => (
                      <span key={key} className="my-4">
                        {key}: {value}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-3 place-content-center gap-5">
      <Button onClick={() => onVideoChoose("VIDEO_ONE")}>Video one</Button>
      <Button onClick={() => onVideoChoose("VIDEO_TWO")}>Video Two</Button>
      <Button onClick={() => onVideoChoose("VIDEO_THREE")}>Video three</Button>
    </div>
  );
};

export default VideoPage;
