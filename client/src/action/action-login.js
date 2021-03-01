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

const saveDataIdentification = (email, name) => {
  return {
    type: "SAVE_DATA_IDENT",
    email,
    name,
  };
};

export { fetchLogin, saveDataIdentification };
