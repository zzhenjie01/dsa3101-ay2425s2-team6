export const CHATBOT_STORAGE_KEY = "chatbotMessages";

/**
 * Load chat history from localStorage.
 * Returns an empty array if no messages are found.
 */
export const loadMessages = () => {
    const storedMessages = localStorage.getItem(CHATBOT_STORAGE_KEY);
    return storedMessages ? JSON.parse(storedMessages) : [
        { text: "Hi there! How can I help you?", sender: "bot", timestamp: new Date().toISOString() }
    ];
};

/**
 * Save chat history to localStorage.
 */
export const saveMessages = (messages) => {
    localStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(messages));
};

/**
 * Clear stored chat history.
 */
export const clearMessages = () => {
    localStorage.removeItem(CHATBOT_STORAGE_KEY);
};
