import axios from "axios";
import { useState, useContext, useRef, useEffect } from "react";
import { ChatBotContext } from "@/context/context";
import { loadMessages, saveMessages } from "@/services/chatbotStorage";

// Displays chat messages between user and bot
export default function ChatbotMessages({ sendMessage }) {
  // Get state of chatbot
  const { chatbotOpen, setChatbotOpen } = useContext(ChatBotContext);

  const [messages, setMessages] = useState([
    //Starting message
    {
      text: "Hi there! How can I help you?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  //Auto-scroll to the bottom of the chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle sending a user's message
  // - Updates chat history
  // - Sends message and chat history to the backend via axios
  const sendMessageInternal = async (input) => {
    // Dont send empty messages
    if (input.trim() === "") return;

    // Message object for user
    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Update local storage by appending user message
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send API request to backend
      const response = await axios.post("http://localhost:8000/esg-data-extraction-model/chatbot", {
        message: input,
        history: messages,
      });

      // Message object for bot
      const botMessage = {
        text: response.data.llm_response,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      // Add bot response to local storage
      setMessages((prev) => [...prev, botMessage]);
      // If there's an error, show a fallback message
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  if (sendMessage) sendMessage.current = sendMessageInternal;

  // Component to show all chat messages
  return (
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
            <span className="text-xs opacity-75">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )
      )}
      <div ref={chatEndRef} /> {/* For auto-scroll */}
    </div>
  );
}
