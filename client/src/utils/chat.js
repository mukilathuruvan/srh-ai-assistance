export const parseAIResponse = (text) => {
    console.log({ text });
    const elements = [];
    let currentText = "";
  
    const codeBlockRegex = /([a-z]+)?\n([\s\S]*?)\n/g;
    const listRegex = /- (.+)/g;
  
    let match;
  
    // Process code blocks
    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (currentText) {
        elements.push({ type: "text", content: currentText });
        currentText = "";
      }
      const lang = match[1];
      const code = match[2];
      elements.push({ type: "code", lang, content: code });
    }
  
    // Process lists
    while ((match = listRegex.exec(text)) !== null) {
      if (currentText) {
        elements.push({ type: "text", content: currentText });
        currentText = "";
      }
      const listItem = match[1];
      elements.push({ type: "list-item", content: listItem });
    }
  
    // Add any remaining text (crucially, this now always happens)
    if (text) {
      // Check if there's any text at all
      currentText += text.slice(codeBlockRegex.lastIndex, listRegex.lastIndex); // Add text between matches
    }
    if (currentText) {
      // Push any remaining text
      elements.push({ type: "text", content: currentText });
    }
  
    return elements;
  };