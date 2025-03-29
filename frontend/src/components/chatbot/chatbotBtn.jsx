import { useContext } from "react";
import { ChatBotContext } from "@/context/context";
import { MessageCircle } from "lucide-react";

// Button to open the chatbot
export default function ChatbotToggleButton() {
  //Get current state of chatbot
  const { chatbotOpen, setChatbotOpen } = useContext(ChatBotContext);

  // Check whether chatbot is open, if not open, render the button, else, render nothing
  return (
    !chatbotOpen && (
      // Button component
      <button
        className="
                  fixed bottom-11 right-0
                  bg-white
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
