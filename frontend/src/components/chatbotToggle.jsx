import { useContext, useState, useEffect, useRef } from "react";
import { ChatBotContext } from "../context/context";
import { X, Send } from "lucide-react";
import ChatbotMessages from "../components/chatbotMessages";
import ChatbotInput from "./chatbotInput";

export default function ChatbotPopup() {
  // Get current state of chatbot
  const { chatbotOpen, setChatbotOpen } = useContext(ChatBotContext);
  const sendMessageRef = useRef(null);

  // Component for the popup window for the chatbot
  return (
    <div
      className={`
            fixed bottom-15 right-5
            w-27/100 min-w-50 h-2/5
            bg-white shadow-lg rounded-lg
            flex flex-col p-4 
            border transition-opacity duration-300
            ${chatbotOpen ? "visible" : "hidden"}`}
    >
      <button // Button to close chatbot window
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        onClick={() => setChatbotOpen(!chatbotOpen)}
      >
        <X className="w-5 h-5" />
      </button>
      
      <ChatbotMessages sendMessage={sendMessageRef} />

      <ChatbotInput sendMessage={(msg) => sendMessageRef.current?.(msg)}/>
    </div>
  );
}
