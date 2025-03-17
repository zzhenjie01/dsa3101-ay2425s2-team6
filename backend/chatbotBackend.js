import express from "express";
import cors from "cors";

const app = express();
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Allow frontend to communicate with backend

// Log all API requests (for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request Body:", req.body);
  next();
});

// Chatbot API Route
app.post("/chat", (req, res) => {
  const userMessage = req.body.message; // Extract the "message" from frontend request
  
  console.log("Received message:", userMessage);

  // Simple bot response logic (Replace with model later)
  let botReply = "I'm not sure how to respond.";
  if (userMessage.toLowerCase().includes("hello")) {
    botReply = "Hi there! How can I help you?";
  } else if (userMessage.toLowerCase().includes("help")) {
    botReply = "Sure! What do you need help with?";
  }

  // Send response back to frontend
  res.json({ reply: botReply });
});

// Add a route for checking if backend is running
app.get("/", (req, res) => {
  res.send("Chatbot API is running!");
});

// Handle unknown routes
app.all("*", (req, res) => {
  res.status(404).json({ error: "Invalid API route. Use POST /chat instead." });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
