import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import user1Img from "./assets/user1.jpeg";
import user2Img from "./assets/user2.jpeg";
import "./App.css";

const SOCKET_URL = "http://192.168.0.103:3000";

const App = () => {
  const [message, setMessage] = useState("");
  const [myId, setMyId] = useState("");
  const [socket, setSocket] = useState(null);
  const [messageFromServer, setMessageFromServer] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      setMyId(socket.id);
      console.log("Connnected !");
      setSocket(socket);
    });

    socket.on("message", (newMessage) => {
      console.log(
        `message from this client ${newMessage.id} to server: `,
        newMessage.message
      );
      setMessageFromServer((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }, []);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <div
      className="con"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="chat-container">
        <div className="message-box">
          {messageFromServer.length != 0 ? (
            messageFromServer.map((message, index) => (
              <div
                style={{
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: `${
                    message.id == myId ? "flex-start" : "flex-end"
                  }`,
                  marginTop: "10px",
                }}
                className="message"
                key={index}
              >
                <div
                  className="chat-box"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#000",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={`${message.id == myId ? user1Img : user2Img} `}
                    alt="error"
                  />
                </div>
                <p
                  className="message-text"
                  style={{
                    background: `${message.id == myId ? "green" : "red"}`,
                    display: "inline-block",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    color: `white`,
                    fontFamily: "monospace",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                >
                  {message.message}
                </p>
              </div>
            ))
          ) : (
            <div className="" style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <h1 className="">Hello world</h1>
            </div>
          )}
        </div>
        <form
          className="form"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40rem",
            gap: "0.5rem",
            height: "min-content",
          }}
        >
          <input
            className="input-field"
            placeholder="Enter your message here !"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
          />
          <button
            onClick={handleSendMessage}
            className="send-button"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
