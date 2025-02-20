import { useMessages } from "@/providers/MessageContextProvider";

const LANGUAGES = [
  {
    code: "es",
    name: "Spanish",
  },
  {
    code: "fr",
    name: "French",
  },
  {
    code: "de",
    name: "German",
  },
  {
    code: "it",
    name: "Italian",
  },
  {
    code: "pt",
    name: "Portuguese",
  },
  {
    code: "nl",
    name: "Dutch",
  },
];

const LanguageList = ({ chosenMessage, onClose }) => {
  const { speakMessage, stopSpeaking } = useMessages();

  const onLanguageClick = (language) => {
    stopSpeaking();
    speakMessage(chosenMessage, language);
  };

  if (!chosenMessage) return null;

  return (
    <ul className="absolute flex gap-0.5 text-xs -bottom-5">
      {LANGUAGES.map((language) => (
        <li
          key={language.code}
          className="bg-gray-200 rounded-full px-2 py-1 cursor-pointer hover:bg-gray-300"
          onClick={() => onLanguageClick(language.code)}
        >
          {language.name}
        </li>
      ))}
      <li
        onClick={() => {
          onClose();
          stopSpeaking();
        }}
        className="bg-red-200 rounded-full px-2 py-1 cursor-pointer hover:bg-red-300 text-gray-800"
      >
        Close
      </li>
    </ul>
  );
};

export default LanguageList;
