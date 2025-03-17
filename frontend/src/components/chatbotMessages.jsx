import axios from "axios";
import { useState, useContext, useRef, useEffect } from "react";
import { ChatBotContext } from "../context/context";

export default function ChatbotMessages({sendMessage}) {
    const { chatbotOpen, setChatbotOpen } = useContext(ChatBotContext);
    const [messages, setMessages] = useState([
        //Starting message
        {
            text: "Hi there! How can I help you?",
            sender: "bot",
        },
    ]);
    
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessageInternal = async (input) => {
        if (input.trim() === "") return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]); // Update chat history

        try {
            // Send API request to backend
            const response = await axios.post("http://localhost:5001/chat", {
                message: input,
            });

            // Add bot response to chat
            setMessages((prev) => [
                ...prev,
                { text: response.data.reply, sender: "bot" },
            ]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((prev) => [
                ...prev,
                { text: "Sorry, something went wrong.", sender: "bot" },
            ]);
         }
    };

    if (sendMessage) sendMessage.current = sendMessageInternal;
    
    return(
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map(
          (
            msg,
            index // Chat history field
          ) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-white max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-blue-500 self-end"
                  : "bg-gray-400 self-start"
              }`}
            >
              {msg.text}
            </div>
          )
        )}
        <div ref={chatEndRef} /> {/* For auto-scroll */}
      </div>
    );
}