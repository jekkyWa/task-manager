const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");
const Cards = require("./models/Cards");
const Board = require("./models/Board");
const User = require("./models/User");

// Key-meaning (email - socket)
let _users = {};

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

app.use("/api/notificationsGet", require("./routes/notifications-get.routes"));

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

  socket.on("setUserId", (email) => {
    _users[email] = socket.id;
  });

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.id);
  });

  // Подключение к команте с notifications
  socket.on("joinNotification", async ({ email }) => {
    const value = await User.find({ email: email });
    socket.emit("getNotifications", value[0].notifications);
  });

  // Подключение к комнате с board

  socket.on("joinroom", async ({ id }) => {
    console.log("join room to the boards " + id);
    socket.join(id);
    const value = await Board.find({ board_id: id });
    const filterCards = await Cards.find({ card_id: value[0].board_item });
    socket.emit("getBoard", { filterCards });
  });

  // подключение к комнате с участниками

  socket.on("joinParticipants", async ({ id }) => {
    console.log("Join Participants " + id + "partic");
    socket.join(id + "partic");
    const value = await Board.find({ board_id: id });
    socket.emit("getRightBoard", value[0]);
  });

  socket.on("leaveRoom", ({ id }) => {
    socket.leave(id);
    console.log("A user left chatroom: " + id);
  });

  // Notifications

  socket.on("sendNotification", async ({ data, message }) => {
    for (let i = 0; i < data.length; i++) {
      await User.updateOne(
        { email: data[i].email },
        { $push: { notifications: message } }
      );
      if (_users[data[i].email]) {
        socket.to(_users[data[i].email]).emit("getNotification", [message]);
      }
    }
  });

  // Отказ от участия в комманде
  socket.on(
    "refuseOffer",
    async ({ id_notification, id_board, email, message }) => {
      console.log(id_notification, id_board, email, message);
      // Нужен: id доски, id уведомления, сообщение, добавить запись в БД
      const user = await User.find({ email });
      const board = await Board.find({ board_id: id_board });

      let boardOriginal = JSON.parse(JSON.stringify(board));
      let userOriginal = JSON.parse(JSON.stringify(user));

      let indexNotification = user[0].notifications.findIndex(
        (e) => e.id_notification == id_notification
      );
      console.log(indexNotification);

      user[0].notifications = [
        ...user[0].notifications.slice(0, indexNotification),
        ...user[0].notifications.slice(indexNotification + 1),
      ];

      board[0].boards_activity = [...board[0].boards_activity, message];
      let indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);

      board[0].addedUsers = [
        ...board[0].addedUsers.slice(0, indexBoard),
        ...board[0].addedUsers.slice(indexBoard + 1),
      ];

      await User.updateOne(userOriginal[0], user[0]);
      await Board.updateOne(boardOriginal[0], board[0]);

      console.log(user[0].notifications.length);
      console.log(_users[email]);

      socket.to(id_board + "partic").emit("getBoardWithNewUser", board[0]);
      io.in(_users[email]).emit(
        "getAfterRefuseNotification",
        user[0].notifications
      );
    }
  );

  // Согласиться участвовать в команде
  socket.on(
    "acceptOffer",
    async ({ id_notification, id_board, email, message }) => {
      // Нужен: id доски, id уведомления, сообщение
      const user = await User.find({ email });
      const board = await Board.find({ board_id: id_board });

      let boardOriginal = JSON.parse(JSON.stringify(board));
      let userOriginal = JSON.parse(JSON.stringify(user));

      let indexNofication = user[0].notifications.findIndex(
        (e) => e.id_notification == id_notification
      );
      user[0].notifications = [
        ...user[0].notifications.slice(0, indexNofication),
        ...user[0].notifications.slice(indexNofication + 1),
      ];

      user[0].passive_rooms = [...user[0].passive_rooms, id_board];

      board[0].boards_activity = [...board[0].boards_activity, message];

      let indexUser = board[0].addedUsers.findIndex((e) => e.email == email);

      board[0].addedUsers[indexUser] = {
        ...board[0].addedUsers[indexUser],
        memberStatus: true,
      };

      await User.updateOne(userOriginal[0], user[0]);
      await Board.updateOne(boardOriginal[0], board[0]);

      const filterRoomsActive = await Board.find({
        board_id: user[0].active_rooms,
      });

      const filterRoomsPassive = await Board.find({
        board_id: user[0].passive_rooms,
      });

      socket.to(id_board + "partic").emit("getBoardWithNewUser", board[0]);
      io.in(_users[email]).emit("getAfterAcceptNotification", {
        user: user[0],
        rooms: {
          active: [...filterRoomsActive],
          passive: [...filterRoomsPassive],
        },
      });
    }
  );

  // -------- Participants

  // Adding a new User to Board
  socket.on("addAdditionalUser", async ({ board_id, data }) => {
    const value = await Board.find({ board_id });
    value[0].addedUsers = [...value[0].addedUsers, data];
    const orgiginalValue = await Board.find({ board_id });

    await Board.updateOne(orgiginalValue[0], value[0]);

    await User.updateOne(
      { email: data.email },
      { $push: { passive_rooms: board_id } }
    );
    io.in(board_id + "partic").emit("getNewUsers", value[0]);
  });

  // Delete User in Board
  socket.on("deleteUser", async ({ id, email }) => {
    const board = await Board.find({ board_id: id });
    const indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);
    board[0].addedUsers = [
      ...board[0].addedUsers.slice(0, indexBoard),
      ...board[0].addedUsers.slice(indexBoard + 1),
    ];
    const boardOriginal = await Board.find({ board_id: id });

    const user = await User.find({ email });
    const indexUser = user[0].passive_rooms.indexOf(id);

    user[0].passive_rooms = [
      ...user[0].passive_rooms.slice(0, indexUser),
      ...user[0].passive_rooms.slice(indexUser + 1),
    ];
    const userOriginal = await User.find({ email });

    const filterRoomsActive = await Board.find({
      board_id: user[0].active_rooms,
    });

    const filterRoomsPassive = await Board.find({
      board_id: user[0].passive_rooms,
    });

    await Board.updateOne(boardOriginal[0], board[0]);
    await User.updateOne(userOriginal[0], user[0]);

    io.emit("getDataAfterDeleteUser", {
      board: board[0],
      user: user[0],
      active: filterRoomsActive,
      passive: filterRoomsPassive,
    });
  });

  // Update the role of user in Command
  socket.on("updateRoleInCommand", async ({ id, email, data }) => {
    const board = await Board.find({ board_id: id });
    let boardOriginal = JSON.parse(JSON.stringify(board));
    const indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);
    board[0].addedUsers[indexBoard].role = data;
    await Board.updateOne(boardOriginal[0], board[0]);

    io.emit("getUpdateRoleInCommand", { board: board[0] });
  });

  socket.on(
    "updateLevelInCommand",
    async ({ id, email, movement, currentState }) => {
      const board = await Board.find({ board_id: id });
      let boardOriginal = JSON.parse(JSON.stringify(board));
      const indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);
      const levelArr = ["Junior", "Middle", "Senior"];
      if (movement == "up" && currentState !== 2) {
        board[0].addedUsers[indexBoard].level = levelArr[currentState + 1];
      }
      if (movement == "down" && currentState !== 0) {
        board[0].addedUsers[indexBoard].level = levelArr[currentState - 1];
      }
      if (JSON.stringify(board) !== JSON.stringify(boardOriginal)) {
        await Board.updateOne(boardOriginal[0], board[0]);
        io.emit("getUpdateLevelInCommand", { board: board[0] });
      }
    }
  );

  // --------- Cards

  // Remove subtask
  socket.on(
    "deleteCheckListItem",
    async ({ id_board, id_card, id_task, id_check_list_item }) => {
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

      const indexListItem = filterItem[0].check_letter.list.findIndex(
        (e) => e.id_check_list_item == id_check_list_item
      );

      // Обновляем элемент
      const newItem = {
        ...filterItem[0],
        check_letter: {
          list: [
            ...filterItem[0].check_letter.list.slice(0, indexListItem),
            ...filterItem[0].check_letter.list.slice(indexListItem + 1),
          ],
          availability: filterItem[0].check_letter.availability,
        },
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

      io.emit("getDataAfterDeleteCheckListItem", value[0]);

      await Cards.updateOne(originalValue[0], value[0]);
    }
  );

  // Change the status of the leaf check element
  socket.on(
    "changeStatusListItem",
    async ({ id_board, id_card, id_task, id_check_list_item, statusBool }) => {
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
      // Поиск нужного элемента чек-листа
      const indexListItem = filterItem[0].check_letter.list.findIndex(
        (e) => e.id_check_list_item == id_check_list_item
      );

      filterItem[0].check_letter.list[indexListItem] = {
        ...filterItem[0].check_letter.list[indexListItem],
        status: statusBool,
      };
      // Находим нужный индекс task
      const index = filterCardItem.card_body.findIndex(
        (e) => e.id_task == id_task
      );
      // Обновляем card_body
      filterCardItem.card_body[index] = filterItem[0];
      // Находим index карточки
      const indexCard = value[0].cards.findIndex(
        (e) => e.card_item_id == id_card
      );
      // Конечное обновление элемента БД
      value[0].cards[indexCard] = filterCardItem;
      // Оригинальный элемент без изменений
      const originalValue = await Cards.find({ card_id: id_board });

      io.emit("getChangeStatusListItem", value[0]);

      await Cards.updateOne(originalValue[0], value[0]);
    }
  );

  // Add Check List item
  socket.on(
    "addCheckListItem",
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
      const newItem = {
        ...filterItem[0],
        check_letter: {
          list: [...filterItem[0].check_letter.list, data],
          availability: filterItem[0].check_letter.availability,
        },
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

      io.emit("getCheckListItem", value[0]);

      await Cards.updateOne(originalValue[0], value[0]);
    }
  );

  // Add Check List
  socket.on(
    "addCheckList",
    async ({ id_board, id_card, id_task, dataBool }) => {
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
        check_letter: { list: [], availability: dataBool },
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

      io.emit("getCheckList", value[0]);

      await Cards.updateOne(originalValue[0], value[0]);
    }
  );

  // Change roles for task
  socket.on("changeRole", async ({ id_board, id_card, id_task, data }) => {
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
      role: data,
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

    io.emit("getChangeRole", value[0]);

    await Cards.updateOne(originalValue[0], value[0]);
  });

  //  Rename the task
  socket.on("rename", async ({ id_board, id_card, id_task, data }) => {
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
      title: data,
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

    io.emit("getRenameData", value[0]);

    await Cards.updateOne(originalValue[0], value[0]);
  });

  // Delete task
  socket.on("deleteTask", async ({ id_board, id_card, id_task }) => {
    const value = await Cards.find({ card_id: id_board });

    const filterItem = value[0].cards.filter((e) => e.card_item_id === id_card);

    const indexItem = filterItem[0].card_body.findIndex((e) => {
      return e.id_task == id_task;
    });

    const newItem = {
      ...filterItem[0],
      card_body: [
        ...filterItem[0].card_body.slice(0, indexItem),
        ...filterItem[0].card_body.slice(indexItem + 1),
      ],
    };

    value[0].cards = value[0].cards.map((e) => {
      return e.card_item_id === newItem.card_item_id ? newItem : e;
    });

    const originalValue = await Cards.find({ card_id: id_board });

    io.in(id_board).emit("getDataAfterDelete", { body: newItem, id: id_task });

    await Cards.updateOne(originalValue[0], value[0]);
  });

  // Completion of the task
  socket.on(
    "completedTask",
    async ({ id_board, id_card, id_task, complet }) => {
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
        state: complet,
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

      io.emit("updateStateComplit", value[0]);

      await Cards.updateOne(originalValue[0], value[0]);
    }
  );

  // Refuse to task
  socket.on("refuseAssignment", async ({ id_board, id_card, id_task }) => {
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
      nameOfTaker: "",
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

    io.emit("getRefuseAssignment", value[0]);

    await Cards.updateOne(originalValue[0], value[0]);
  });

  // Adding a comment
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

  // Additional opportunities to take a task
  socket.on(
    "addUserToDo",
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

      value[0].recentActivity = [...value[0].recentActivity, dataActiv];

      io.emit("newUserToDo", value[0]);
      io.emit("taskTake", value[0].recentActivity);

      await Cards.updateOne(originalValue[0], value[0]);
    }
  );

  // Adding a description
  socket.on(
    "addDescriptionToTask",
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

      value[0].recentActivity = [...value[0].recentActivity, dataActiv];

      io.emit("newDescriptionTask", value[0]);
      io.emit("descriptionTaskActivity", value[0].recentActivity);

      await Cards.updateOne(originalValue[0], value[0]);
    }
  );

  // Adding a new task
  socket.on("addTask", async ({ data, dataActiv }) => {
    const { card_item_id, card_id, task } = data;

    const value = await Cards.find({ card_id });

    const filterItem = value[0].cards.filter(
      (e) => e.card_item_id === card_item_id
    );

    const newItem = {
      ...filterItem[0],
      card_body: [...filterItem[0].card_body, task],
    };

    value[0].cards = value[0].cards.map((e) => {
      return e.card_item_id === newItem.card_item_id ? newItem : e;
    });

    const originalValue = await Cards.find({ card_id });

    value[0].recentActivity = [...value[0].recentActivity, dataActiv];

    io.in(card_id).emit("newTask", { ...newItem });
    io.emit("newTaskActivity", value[0].recentActivity);

    await Cards.updateOne(originalValue[0], value[0]);
  });

  // Add a new card
  socket.on("addCard", async ({ data, id, dataActiv, roleBack, levelBack }) => {
    const value = await Cards.find({ card_id: id });
    value[0].cards = [...value[0].cards, data];
    // Obtaining data
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
    value[0].recentActivity = [...value[0].recentActivity, dataActiv];

    const notFilter = await Cards.find({ card_id: id });
    notFilter[0].cards = [...notFilter[0].cards, data];
    notFilter[0].recentActivity = [...notFilter[0].recentActivity, dataActiv];

    const originalValue = await Cards.find({ card_id: id });

    io.in(id).emit("getCardItem", {
      filterCards: value[0],
      original: notFilter[0],
    });
    io.in(id).emit("getCardActivity", value[0].recentActivity);

    await Cards.updateOne(originalValue[0], notFilter[0]);
  });

  // Getting cards
  socket.on("joinCard", async ({ id, roleBack, levelBack }) => {
    console.log("Join_CARD", id);
    socket.join(id);
    const value = await Cards.find({ card_id: id });
    // Obtaining data
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

  // Adding a new board
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
