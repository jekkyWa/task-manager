const fetchLogin = (token, userId, login, logout, isAuthenticated) => {
  return {
    type: "FETCH_LOGIN",
    token,
    userId,
    login,
    logout,
    isAuthenticated,
  };
};

const saveDataIdentification = (email, name, rooms) => {
  return {
    type: "SAVE_DATA_IDENT",
    email,
    name,
    rooms,
  };
};

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

const modalShow = (show) => {
  return {
    type: "MODAL_SHOW",
    show,
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

const modalRoleShow = (roleShow) => {
  return {
    type: "MODAL_ROLE_SHOW",
    roleShow,
  };
};

const modalRoleChange = (changeRole) => {
  return {
    type: "MODAL_ROLE_CHANGE",
    changeRole,
  };
};

export {
  fetchLogin,
  saveDataIdentification,
  saveDataCards,
  saveActivityCard,
  saveSocket,
  saveRole,
  saveFullCard,
  saveDataToModal,
  modalShow,
  displaySelection,
  recentActivity,
  roleForNewTask,
  modalRoleShow,
  modalRoleChange,
};
