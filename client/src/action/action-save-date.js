const saveDataCards = (boards) => {
  return {
    type: "SAVE_BOARD_DATA",
    boards,
  };
};

const saveActivityCard = (card) => {
  return {
    type: "SAVE_ACTIVITY_CARD",
    card,
  };
};

const saveSocket = (socket) => {
  return {
    type: "SAVE_SOCKET",
    socket,
  };
};

const saveRole = (roleProfileInBoard) => {
  return {
    type: "SAVE_ROLE",
    roleProfileInBoard,
  };
};

const saveFullCard = (cardFull) => {
  return {
    type: "SAVE_FULL_TASK",
    cardFull,
  };
};

const saveDataToModal = (dataToModal) => {
  return {
    type: "SAVE_DATA_TO_MODAL",
    dataToModal,
  };
};

const saveActiveBoard = (boardActive) => {
  return {
    type: "SAVE_ACTIVE_BOARD",
    boardActive,
  };
};

const saveNotifications = (notifications) => {
  return {
    type: "SAVE_NOTIFICATIONS",
    notifications,
  };
};

const saveImportantEvents = (importantEvents) => {
  return {
    type: "SAVE_IMPORTANT_EVENTS",
    importantEvents,
  };
};

const saveDataForBoardsPage = (allDataForBoardsPage) => {
  return {
    type: "SAVE_DATA_FOR_BOARDS_PAGE",
    allDataForBoardsPage,
  };
};

export {
  saveRole,
  saveSocket,
  saveFullCard,
  saveDataCards,
  saveDataToModal,
  saveActiveBoard,
  saveActivityCard,
  saveNotifications,
  saveImportantEvents,
  saveDataForBoardsPage,
};
