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

const saveDataIdentification = (email, name,active_rooms) => {
  return {
    type: "SAVE_DATA_IDENT",
    email,
    name,
    active_rooms
  };
};

export { fetchLogin, saveDataIdentification };
