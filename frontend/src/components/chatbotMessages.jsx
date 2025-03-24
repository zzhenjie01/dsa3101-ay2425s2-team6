import axios from "axios";
import { useState, useContext, useRef, useEffect } from "react";
import { ChatBotContext } from "../context/context";
import { loadMessages,saveMessages } from "../services/chatbotStorage";

export default function ChatbotMessages({sendMessage}) {
    const { chatbotOpen, setChatbotOpen } = useContext(ChatBotContext);
    const [messages, setMessages] = useState([
        //Starting message
        {
            text: "Hi there! How can I help you?",
            sender: "bot",
            timestamp: new Date().toISOString()
        },
    ]);
    
    const chatEndRef = useRef(null);

    useEffect(() => {
        saveMessages(messages);
    }, [messages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessageInternal = async (input) => {
        if (input.trim() === "") return;

        const userMessage = { text: input, sender: "user", timestamp: new Date().toISOString()};
        setMessages((prev) => [...prev, userMessage]); // Update chat history

        try {
            // Send API request to backend
            const response = await axios.post("http://localhost:8000/chatbot", {
                message: input,
                history: messages
            });

            const botMessage = {
                text: response.data.llm_response,
                sender: "bot",
                timestamp: new Date().toISOString()
            };

            // Add bot response to chat
            setMessages((prev) => [
                ...prev,
                botMessage,
            ]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((prev) => [
                ...prev,
                { text: "Sorry, something went wrong.", sender: "bot", timestamp: new Date().toISOString()},
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
              <p>{msg.text}</p>
              <span className="text-xs opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          )
        )}
        <div ref={chatEndRef} /> {/* For auto-scroll */}
      </div>
    );
}