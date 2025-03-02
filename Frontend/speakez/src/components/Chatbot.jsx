import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setChat([...chat, { sender: "user", text: message }]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: message,
      });

      // Add bot response to chat
      setChat((prevChat) => [...prevChat, { sender: "bot", text: response.data.reply }]);
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Chatbot</h2>
      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#4CAF50" : "#0084FF",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "500px", margin: "auto", textAlign: "center", padding: "20px" },
  chatBox: { height: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #ddd", padding: "10px" },
  message: { padding: "10px", borderRadius: "10px", color: "white", maxWidth: "70%" },
  inputContainer: { display: "flex", marginTop: "10px" },
  input: { flex: 1, padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { marginLeft: "10px", padding: "10px 20px", background: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default Chatbot;
