import { useState, useRef, useEffect } from "react";
import axios from "axios";
import microphone from "../static/microphone.png";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  // **Fetch Available Voices for Speech Synthesis**
  useEffect(() => {
    const loadVoices = () => {
      const synthVoices = speechSynthesis.getVoices();
      setVoices(synthVoices);
      if (synthVoices.length > 0) setSelectedVoice(synthVoices[0]); // Default to first voice
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);

  // **Send Message to API**
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setChat((prevChat) => [...prevChat, { sender: "user", text }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/chat`, { message: text });

      let botMessage = response.data.reply;
      botMessage = cleanResponse(botMessage); // Clean unwanted characters
      setChat((prevChat) => [...prevChat, { sender: "bot", text: botMessage }]);
      speakText(botMessage);

    } catch (error) {
      console.error("Error:", error);
      setChat((prevChat) => [...prevChat, { sender: "bot", text: "Sorry, something went wrong!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // **Clean the Response**
  const cleanResponse = (text) => {
    return text.replace(/\*/g, ""); // Remove asterisks
  };

  // **Speak the Bot Response**
  const speakText = (text) => {
    if ("speechSynthesis" in window && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // Adjust language if needed
      utterance.rate = 1; // Normal speech rate
      utterance.pitch = 1; // Normal pitch
      utterance.voice = selectedVoice; // Use the selected voice
      speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported or no voice selected.");
    }
  };

  // **Start Voice Recognition**
  const startListening = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    setIsListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setMessage(transcript);

      // Reset silence timer
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        stopListening();
        sendMessage(transcript); 
      }, 2000);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
  };

  // **Stop Listening**
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>SPEAK-EZ</h2>

      {/* Chatbox */}
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

      {/* Input & Buttons */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage(message)}
        />
        <button style={styles.button} onClick={() => sendMessage(message)} disabled={isLoading}>
          Send
        </button>

        {/* Speech Recognition Button */}
        <button style={styles.micButton} onClick={isListening ? stopListening : startListening}>
          <img src={microphone} alt="Mic" style={styles.micIcon} />
        </button>
      </div>

      {/* Voice Selection Dropdown */}
      <div style={styles.voiceSelection}>
        <select onChange={(e) => setSelectedVoice(voices.find((voice) => voice.name === e.target.value))} value={selectedVoice?.name || ""}>
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// **Styles**
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
    alignItems: "center",
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
  micButton: {
    marginLeft: "10px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  micIcon: {
    width: "30px",
    height: "30px",
  },
  voiceSelection: {
    marginTop: "10px",
    color: "white",
  },
};

export default Chatbot;
