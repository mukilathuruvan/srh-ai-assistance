import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const Bubble = ({ message, model }) => {
  const content =
    model === "gpt"
      ? parseGPTMessage(message.content)
      : parseGeminiMessage(message.content);

  return (
    <div className="flex gap-2">
      <span
        className={`h-9 min-w-10 cursor-pointer rounded-full uppercase text-center text-xs bg-gray-200 grid place-content-center ${
          model === "gpt" ? "bg-blue-800 text-white" : "bg-gray-800 text-white"
        }`}
      >
        {model === "gpt" ? "C" : "G"}
      </span>

      <div className="grid">
        {message.response_time && message.role === "assistant" && (
          <span className="text-green-700 text-sm">
            Response time: {message.response_time}s
          </span>
        )}

        <span>{content}</span>
      </div>
    </div>
  );
};

export default Bubble;

const parseGPTMessage = (content) => {
  const parts = content.split(/(```[\s\S]*?```|\n+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```")) {
      // Code block
      const lines = part.split("\n");
      const language = lines[0].replace(/```/g, "").trim();
      const code = lines.slice(1, -1).join("\n");
      return (
        <SyntaxHighlighter key={index} language={language || "text"} style={tomorrow}>
          {code}
        </SyntaxHighlighter>
      );
    } else {
      return part
        .split("\n")
        .map((line, i) => {
          if (/^#{2,3}\s/.test(line)) {
            // Header (h2 or h3)
            const level = line.startsWith("###") ? 3 : 2;
            return React.createElement(`h${level}`, { key: i }, line.replace(/^#{2,3}\s/, ""));
          } else if (/^\d+\./.test(line)) {
            // Numbered list item
            return <li key={i}>{line.replace(/^\d+\.\s*/, "")}</li>;
          } else if (line.startsWith("- ")) {
            // Bullet point
            return <li key={i}>{line.substring(2)}</li>;
          } else if (line.trim() !== "") {
            // Regular paragraph
            return <p key={i}>{line}</p>;
          }
          return null;
        })
        .filter(Boolean);
    }
  });
};

const parseGeminiMessage = (content) => {
  const sections = content.split("\n\n");

  return sections.map((section, index) => {
    if (section.startsWith("```")) {
      const lines = section.split("\n");
      const language = lines[0].replace(/```/g, "").trim();
      const code = lines.slice(1, -1).join("\n").trim();
      return (
        <SyntaxHighlighter key={index} language={language || "text"} style={tomorrow}>
          {code}
        </SyntaxHighlighter>
      );
    } else if (/:\s*$/.test(section)) {
      // Header detection based on colons at the end of the line
      return <h2 key={index}>{section.replace(/\\/g, "")}</h2>;
    } else if (section.includes("\n* ")) {
      // Unordered list
      const [title, ...items] = section.split("\n");
      return (
        <React.Fragment key={index}>
          <p>{title}</p>
          <ul>
            {items.map((item, i) => (
              <li key={i}>{item.replace("* ", "")}</li>
            ))}
          </ul>
        </React.Fragment>
      );
    } else {
      return section.split("\n").map((line, i) => <p key={i}>{line}</p>);
    }
  });
};
