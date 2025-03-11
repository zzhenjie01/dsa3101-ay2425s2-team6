import "./ChatbotToggle.css";
import { useContext, useState, useEffect, useRef } from "react";
import { ChatBotContext } from "../context/contexts";
import { X, MessageCircle, Send } from "lucide-react";
import axios from "axios";

function ChatbotToggleButton() {
  const { chatbotOpen, setChatbotOpen } = useContext(ChatBotContext);
  return (
    !chatbotOpen && (
      <button
        className="
                fixed bottom-11 right-0
                w-27/100
                h-10
                border-black border-2"
        onClick={() => setChatbotOpen(!chatbotOpen)}
      >
        <MessageCircle className="inline w-5 h-5 mr-2" />
        Open Chat
      </button>
    )
  );
}

function ChatbotPopup() {
  const { chatbotOpen, setChatbotOpen } = useContext(ChatBotContext);
  const [messages, setMessages] = useState([
    //Starting message
    {
      text: "Hi there! How can I help you?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]); // Update chat history
    setInput("");

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

      <div className="flex p-2 border-t">
        <input //Input field and send button
          type="text"
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Enter to send
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r-lg"
          onClick={sendMessage}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function ChatbotDiv() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const chatbotOpenObj = {
    chatbotOpen,
    setChatbotOpen,
  };
  return (
    <ChatBotContext.Provider value={chatbotOpenObj}>
      <ChatbotToggleButton />
      <ChatbotPopup />
    </ChatBotContext.Provider>
  );
}
