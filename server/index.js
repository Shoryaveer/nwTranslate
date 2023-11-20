require('dotenv').config();

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const deepl = require('deepl-node');


const authKey = process.env.AUTH_KEY
const translator = new deepl.Translator(authKey);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async (data) => {
    if (data.preferredLang != "es") {
      output = await translator.translateText(data.message, null, "es")
      data.message = output.text
    } else {
      output = await translator.translateText(data.message, null, "en-US")
      data.message = output.text
    }
    console.log(data)
    socket.to(data.room).emit("receive_message", data);
  });

  // socket.on("translate", async (data) => {
  //   try {
  //     const result = await translator.translateText(data.message, null, data.targetLang);
  //     const translatedMessage = result.text;

  //     // Send back the translated message to the same client
  //     socket.emit("receive_translation", {
  //       author: data.author,
  //       translatedMessage: translatedMessage
  //     });
  //   } catch (error) {
  //     console.error("Error during translation:", error);
  //     // socket.emit("translation_error", { message: "Translation failed" });
  //   }
  // });



  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
