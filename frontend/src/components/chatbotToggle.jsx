import './chatbotToggle.css';
import { useContext, useState } from 'react';
import { ChatBotContext } from '../context/contexts';
function ChatbotToggleButton()
{
    const {chatbotOpen, setChatbotOpen } = useContext(ChatBotContext);
    return (
        <button className='
                absolute bottom-0 right-0
                w-27/100
                h-10
                border-black border-2'
                onClick={()=>setChatbotOpen(!chatbotOpen)}>
            Click here to open chatbot
        </button>
    )
}

/*
Need to do responsive chatbot on resizing
*/
function ChatbotPopup()
{
    const { chatbotOpen } = useContext(ChatBotContext);
    return (
        <div className={`
            absolute bottom-10 right-0
            w-27/100 min-w-50 h-2/5
            border-gray border-2
            flex justify-center items-center
            ${chatbotOpen ? "visible" : "hidden"}`}>
            This is a popup for the chatbot
        </div>
    )
}

export default function ChatbotDiv()
{   
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const chatbotOpenObj = {
        chatbotOpen, setChatbotOpen
    };
    return (
        <ChatBotContext.Provider value={chatbotOpenObj}>
            <ChatbotToggleButton/>
            <ChatbotPopup/>
        </ChatBotContext.Provider>
    )
}