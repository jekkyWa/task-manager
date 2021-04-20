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

const markBoard = (marksBoard) => {
  return {
    type: "MARK_BOARD",
    marksBoard,
  };
};

const displaySelection = (valueDisplay) => {
  return {
    type: "DISPLAY_SELECTION",
    valueDisplay,
  };
};

const recentActivity = (activData) => {
  return {
    type: "RECENT_ACTIVITY",
    activData,
  };
};

const roleForNewTask = (saveRole) => {
  return {
    type: "ROLE_FOR_NEW_TASK",
    saveRole,
  };
};

export {
  saveRole,
  markBoard,
  saveSocket,
  saveFullCard,
  saveDataCards,
  roleForNewTask,
  recentActivity,
  saveDataToModal,
  saveActiveBoard,
  displaySelection,
  saveActivityCard,
  saveNotifications,
  saveImportantEvents,
  saveDataForBoardsPage,
};
