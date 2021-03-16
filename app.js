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

  socket.on("joinroom", async ({ id }) => {
    console.log("join room");
    console.log(id);
    socket.join(id);
    const value = await Board.find({ board_id: id });
    console.log(value)
    const filterCards = await Card.find({ card_id: value[0].board_item });

    socket.emit("getBoard", { filterCards });
  });

  socket.on("leaveRoom", ({ id }) => {
    socket.leave(id);
    console.log("A user left chatroom: " + id);
  });

  socket.on("board", async ({ dataForSend, id }) => {
    const { name_Board, color, card_id, cards, board_id } = dataForSend;
    const card = new Card({
      name_Board,
      color,
      card_id,
      board_id,
      cards,
    });

    console.log("--------------", dataForSend);

    io.in(id).emit("newBoard", {
      card_id,
      cards,
      color,
      name_Board,
    });

    await card.save();

    const value = await Board.find({ board_id: board_id });

    await Board.updateOne(value[0], {
      ...value,
      board_item: [...value[0].board_item, card_id],
    });
  });
});
