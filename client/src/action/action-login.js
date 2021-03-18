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

export {
  fetchLogin,
  saveDataIdentification,
  saveDataCards,
  saveActivityCard,
  saveSocket,
  saveRole,
};
