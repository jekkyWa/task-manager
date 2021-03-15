const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");
const Card = require("./models/Cards");
const Board = require("./models/Board");

mongoose.connect(config.get("mongoUri"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();

app.use(express.json({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200,
  })
);

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/getData", require("./routes/data.routes"));

app.use("/api/", require("./routes/board.routes"));

app.use("/api/", require("./routes/task.routes"));

app.use("/api/", require("./routes/data-boards.routes"));

app.use("/api/", require("./routes/data-cards.routes"));

app.use("/api/", require("./routes/add-card.routes"));

const PORT = config.get("port") || 5000;

const server = app.listen(PORT, () =>
  console.log(`App has been started on ${PORT}`)
);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.id);
  });

  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("board", async ({ dataForSend, id }) => {
    console.log(dataForSend);
    const { name_Board, color, card_id, cards, board_id } = dataForSend;

    const card = new Card({
      name_Board,
      color,
      card_id,
      board_id,
      cards,
    });

    const value = await Board.find({ board_id: board_id });

    await card.save();

    io.emit("newBoard", {
      color,
      name_Board,
      card_id,
      board_id,
      cards,
    });

    await Board.updateOne(value[0], {
      ...value,
      board_item: [...value[0].board_item, card_id],
    });
  });
});
