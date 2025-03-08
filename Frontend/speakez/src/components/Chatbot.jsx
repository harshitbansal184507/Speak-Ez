import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Scroll to the bottom of the chat box when a new message is added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setChat((prevChat) => [...prevChat, { sender: "user", text: message }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/chat`, {
        message: message,
      });

      // Add bot response to chat
      setChat((prevChat) => [...prevChat, { sender: "bot", text: response.data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setChat((prevChat) => [...prevChat, { sender: "bot", text: "Sorry, something went wrong!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>SPEAK-EZ</h2>
      <div style={styles.chatBox} ref={chatBoxRef}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#FF4D4D" : "#333",
            }}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div style={{ ...styles.message, alignSelf: "flex-start", backgroundColor: "#333" }}>
            Typing...
          </div>
        )}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#1E1E1E",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  },
  title: {
    color: "#FF4D4D",
    fontSize: "24px",
    marginBottom: "20px",
  },
  chatBox: {
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    border: "1px solid #444",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#2A2A2A",
  },
  message: {
    padding: "12px",
    borderRadius: "10px",
    color: "white",
    maxWidth: "70%",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  inputContainer: {
    display: "flex",
    marginTop: "15px",
  },
  input: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#2A2A2A",
    color: "white",
    outline: "none",
  },
  button: {
    marginLeft: "10px",
    padding: "12px 20px",
    background: "#FF4D4D",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
};

export default Chatbot;