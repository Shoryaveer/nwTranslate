import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
// import { translateText } from './translate.js';
import * as deepl from 'deepl-node';

const authKey = "2de7d025-1190-dae9-3340-692a41756c47:fx"; // Replace with your key
const translator = new deepl.Translator(authKey);

async function translateText(text, fromLanguage, toLanguage) {
    try {
        const result = await translator.translateText(text, fromLanguage, toLanguage);
        return result.text; // The translated text
    } catch (error) {
        // Handle the error appropriately in your context
        console.error('Error during translation:', error);
        throw error; // Rethrow the error if you want to handle it at a higher level
    }
}


async function Chat({ socket, username, room, preferredLang }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        preferredLang: preferredLang,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map(async (messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                    <hr></hr>
                    <p>{await translateText(messageContent.message, messageContent.preferredLang, preferredLang)}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="--"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
