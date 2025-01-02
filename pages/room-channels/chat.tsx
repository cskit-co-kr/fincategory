import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface Message {
  text: string | null;
  file: string | null;
}

const socket: Socket = io("http://localhost:8080");
// console.log("socket", socket);
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message: Message = { text: input, file: null };
      socket.emit("sendMessage", message);
      //   setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  const sendFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        "http://localhost:8080/v1/files/uploadFile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const message: Message = {
        text: null,
        file: `http://localhost:8080/v1/files/getImage?image_path=${response.data.path}`,
      };
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, message]);
      setFile(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: "300px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.text && <p>{msg.text}</p>}
            {msg.file && (
              <p>
                {msg.file.endsWith(".jpg") || msg.file.endsWith(".png") ? (
                  <img
                    src={msg.file}
                    alt="uploaded"
                    style={{ maxWidth: "100px" }}
                  />
                ) : msg.file.endsWith(".mp4") ? (
                  <video controls style={{ maxWidth: "100px" }}>
                    <source src={msg.file} type="video/mp4" />
                  </video>
                ) : (
                  <a href={msg.file} target="_blank" rel="noopener noreferrer">
                    Open File
                  </a>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%", marginRight: 10 }}
      />
      <button onClick={sendMessage}>Send</button>
      <br />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={sendFile}>Send File</button>
    </div>
  );
};

export default Chat;
