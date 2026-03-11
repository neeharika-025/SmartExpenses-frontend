// AI Chatbot Component - Simple floating chat widget with Gemini AI
import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { sendChatMessage } from "../../services/api";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! I'm your AI assistant. Ask me anything!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();

    const userMessage = inputMessage.trim();
    if (!userMessage || isLoading) {
      console.log("Cannot send: empty message or loading");
      return;
    }

    console.log("=== SENDING MESSAGE ===");
    console.log("Message:", userMessage);

    // Clear input immediately
    setInputMessage("");

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      console.log("Calling API...");
      const response = await sendChatMessage(userMessage);
      console.log("API Response:", response.data);

      // Add bot response
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: response.data.reply || "Got your message!" },
      ]);
      console.log("=== MESSAGE SENT SUCCESSFULLY ===");
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Sorry, something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <FaRobot className="chatbot-header-icon" />
              <div>
                <h3>AI Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === "bot" && <FaRobot className="bot-icon" />}
                <div className="message-text">{msg.text}</div>
              </div>
            ))}

            {isLoading && (
              <div className="message bot">
                <FaRobot className="bot-icon" />
                <div className="typing">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputMessage.trim() || isLoading}
              onClick={handleSendMessage}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
