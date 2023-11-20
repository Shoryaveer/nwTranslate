import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
// import { translateText } from './translate.js';
// import * as deepl from 'deepl-node';

// const authKey = "---"; // Replace with your key
// const translator = new deepl.Translator(authKey);

// async function translateText(text, toLanguage) {
//     try {
//         const result = await translator.translateText(text, null, toLanguage);
//         return result.text; // The translated text
//     } catch (error) {
//         // Handle the error appropriately in your context
//         console.error('Error during translation:', error);
//         throw error; // Rethrow the error if you want to handle it at a higher level
//     }
// }


function Chat({ socket, username, room, preferredLang }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  // const [translatedMessage, setTranslatedMessage] = useState([]);


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
      // await socket.emit("translate", {author : username, message : messageList.message, targetLang: preferredLang});
    });
  }, [socket]);

  // useEffect(() => {
  //   socket.on("receive_translation", async (data) => {
  //     setTranslatedMessage((list) => [...list, data]);
  //   });
  // }, [socket]);


  return (
    <div className="chat-window">
      <div className="chat-title">
        <img src="switch-logo.png" width="200"/>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                    <hr></hr>
                    {
                        <p>{preferredLang === "ES"? messageContent.ES:messageContent.EN}</p>
                        // <p>{messageContent.translated}</p>
                    }
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
          placeholder="..."
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
