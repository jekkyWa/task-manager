const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");
const Cards = require("./models/Cards");
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

// app.use("/api/", require("./routes/task.routes"));

// app.use("/api/", require("./routes/data-boards.routes"));

// app.use("/api/", require("./routes/data-cards.routes"));

// app.use("/api/", require("./routes/add-card.routes"));

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
    socket.join(id);
    const value = await Board.find({ board_id: id });
    const filterCards = await Cards.find({ card_id: value[0].board_item });

    socket.emit("getBoard", { filterCards });
  });

  socket.on("leaveRoom", ({ id }) => {
    socket.leave(id);
    console.log("A user left chatroom: " + id);
  });

  // Добавление комментария

  socket.on(
    "addComment",
    async ({ id_board, id_card, id_task, data, dataActiv }) => {
      // Поиск нужного элемента в БД
      const value = await Cards.find({ card_id: id_board });
      // Ищем нужную карточку
      const filterCardItem = value[0].cards.filter(
        (e) => e.card_item_id == id_card
      )[0];
      // Ищем нужный Task
      const filterItem = filterCardItem.card_body.filter(
        (e) => e.id_task == id_task
      );
      // Обновляем элемент
      const newItem = {
        ...filterItem[0],
        comment: [...filterItem[0].comment, data],
      };
      // Находим нужный индекс task
      const index = filterCardItem.card_body.findIndex(
        (e) => e.id_task == id_task
      );
      // Обновляем card_body
      filterCardItem.card_body[index] = newItem;
      // Находим index карточки
      const indexCard = value[0].cards.findIndex(
        (e) => e.card_item_id == id_card
      );
      // Конечное обновление элемента БД
      value[0].cards[indexCard] = filterCardItem;
      // Оригинальный элемент без изменений
      const originalValue = await Cards.find({ card_id: id_board });

      value[0].recentActivity = [...value[0].recentActivity, dataActiv];

      io.emit("newComment", value[0]);
      io.emit("newСommentEvent", value[0].recentActivity);

      await Cards.updateOne(originalValue[0], value[0]);
    }
  );

  // Добавление описания

  socket.on("addUserToDo", async ({ id_board, id_card, id_task, data }) => {
    // Поиск нужного элемента в БД
    const value = await Cards.find({ card_id: id_board });
    // Ищем нужную карточку
    const filterCardItem = value[0].cards.filter(
      (e) => e.card_item_id == id_card
    )[0];
    // Ищем нужный Task
    const filterItem = filterCardItem.card_body.filter(
      (e) => e.id_task == id_task
    );
    // Обновляем элемент
    const newItem = { ...filterItem[0], nameOfTaker: data };
    // Находим нужный индекс task
    const index = filterCardItem.card_body.findIndex(
      (e) => e.id_task == id_task
    );
    // Обновляем card_body
    filterCardItem.card_body[index] = newItem;
    // Находим index карточки
    const indexCard = value[0].cards.findIndex(
      (e) => e.card_item_id == id_card
    );
    // Конечное обновление элемента БД
    value[0].cards[indexCard] = filterCardItem;
    // Оригинальный элемент без изменений
    const originalValue = await Cards.find({ card_id: id_board });

    io.emit("newUserToDo", value[0]);

    await Cards.updateOne(originalValue[0], value[0]);
  });

  socket.on(
    "addDescriptionToTask",
    async ({ id_board, id_card, id_task, data }) => {
      // Поиск нужного элемента в БД
      const value = await Cards.find({ card_id: id_board });
      // Ищем нужную карточку
      const filterCardItem = value[0].cards.filter(
        (e) => e.card_item_id == id_card
      )[0];
      // Ищем нужный Task
      const filterItem = filterCardItem.card_body.filter(
        (e) => e.id_task == id_task
      );
      // Обновляем элемент
      const newItem = { ...filterItem[0], description: data };
      // Находим нужный индекс task
      const index = filterCardItem.card_body.findIndex(
        (e) => e.id_task == id_task
      );
      // Обновляем card_body
      filterCardItem.card_body[index] = newItem;
      // Находим index карточки
      const indexCard = value[0].cards.findIndex(
        (e) => e.card_item_id == id_card
      );
      // Конечное обновление элемента БД
      value[0].cards[indexCard] = filterCardItem;
      // Оригинальный элемент без изменений
      const originalValue = await Cards.find({ card_id: id_board });

      io.emit("newDescriptionTask", value[0]);

      await Cards.updateOne(originalValue[0], value[0]);
    }
  );

  // Добавление новой карточки
  socket.on("addTask", async ({ data }) => {
    const { card_item_id, card_id, task } = data;

    const value = await Cards.find({ card_id });

    const filterItem = value[0].cards.filter(
      (e) => e.card_item_id === card_item_id
    );

    const newItem = {
      ...filterItem[0],
      card_body: [...filterItem[0].card_body, task],
    };

    io.in(card_id).emit("newTask", { ...newItem });

    await Cards.updateOne(value[0], {
      ...value,
      cards: value[0].cards.map((e) => {
        return e.card_item_id === newItem.card_item_id ? newItem : e;
      }),
    });
  });

  socket.on("addCard", async ({ data, id }) => {
    const value = await Cards.find({ card_id: id });

    io.in(id).emit("getCardItem", {
      cards: [...value[0].cards, data],
    });

    await Cards.updateOne(value[0], {
      ...value,
      cards: [...value[0].cards, data],
    });
  });
  // Получение карточек
  socket.on("joinCard", async ({ id, roleBack, levelBack }) => {
    console.log("Join_CARD", id);
    socket.join(id);
    const value = await Cards.find({ card_id: id });
    // Получение данных по роли
    const filterTaskRole = value[0].cards.map((e) => {
      return {
        ...e,
        card_body: e.card_body.filter((elem) => {
          const statusProfile = (status) => {
            return status == "Senior" ? 3 : status == "Middle" ? 2 : 1;
          };
          return (
            (elem.role.findIndex((element) => element.role == roleBack) !==
              -1 &&
              elem.role.findIndex(
                (element) =>
                  statusProfile(element.level) <= statusProfile(levelBack)
              ) !== -1) ||
            roleBack == "Product manager"
          );
        }),
      };
    });

    value[0].cards = filterTaskRole;

    // Обычное получение данных
    const originalValue = await Cards.find({ card_id: id });

    socket.emit("getCard", { filterCards: value, original: originalValue });
  });

  socket.on("board", async ({ dataForSend, id }) => {
    const { name_Board, color, card_id, cards, board_id } = dataForSend;
    const board = new Cards({
      name_Board,
      color,
      card_id,
      board_id,
      cards,
    });

    io.in(id).emit("newBoard", {
      card_id,
      cards,
      color,
      name_Board,
    });

    await board.save();

    const value = await Board.find({ board_id: board_id });

    await Board.updateOne(value[0], {
      ...value,
      board_item: [...value[0].board_item, card_id],
    });
  });
});
