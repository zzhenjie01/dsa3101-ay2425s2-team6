import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatbotInput({sendMessage}){
    // State for capturing the text that the user types
    const [input, setInput] = useState("");
    
    const handleSendMessage = () => {
        if (input.trim()) {
          sendMessage(input);
          setInput("");
        }
    };

    return(
        <div className="flex p-2 border-t">
        {/* Input field for the user's message */} 
        <input 
          type="text"
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)} // Updates `input` state whenever user types
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Send message on Enter press
        />
        {/* The send button sends message when clicked */}
        <button
          className="bg-blue-600 text-white px-4 rounded-r-lg"
          onClick={handleSendMessage}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    );
}