import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatbotInput({sendMessage}){
    const [input, setInput] = useState("");
    
    const handleSendMessage = () => {
        if (input.trim()) {
          sendMessage(input);
          setInput("");
        }
    };

    return(
        <div className="flex p-2 border-t">
        <input //Input field and send button
          type="text"
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Enter to send
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r-lg"
          onClick={handleSendMessage}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    );
}