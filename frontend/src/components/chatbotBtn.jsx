import { useContext } from "react";
import { ChatBotContext } from "../context/context";
import { MessageCircle } from "lucide-react";

export default function ChatbotToggleButton() {
    const { chatbotOpen, setChatbotOpen } = useContext(ChatBotContext);
    return (
      !chatbotOpen && (
        <button
          className="
                  fixed bottom-11 right-0
                  w-27/100
                  h-10
                  border-black border-2
                  hover:cursor-pointer"
          onClick={() => setChatbotOpen(!chatbotOpen)}
        >
          <MessageCircle className="inline w-5 h-5 mr-2" />
          Open Chat
        </button>
      )
    );
  }