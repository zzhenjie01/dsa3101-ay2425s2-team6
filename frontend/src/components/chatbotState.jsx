import { useState } from "react";
import { useLocation } from "react-router";
import { ChatBotContext } from "../context/context";
import ChatbotToggleButton from "../components/chatbotBtn";
import ChatbotPopup from "../components/chatbotToggle";

export default function ChatbotState() {
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const chatbotOpenObj = {
      chatbotOpen,
      setChatbotOpen,
    };
  
    // Do not show chatbot at the login/register pages
    const location = useLocation();
    console.log(location.pathname);
    if (
      location.pathname === "/login-page" ||
      location.pathname === "/register-page"
    ) {
      return null;
    }
  
    return (
      <ChatBotContext.Provider value={chatbotOpenObj}>
        <ChatbotToggleButton />
        <ChatbotPopup />
      </ChatBotContext.Provider>
    );
}