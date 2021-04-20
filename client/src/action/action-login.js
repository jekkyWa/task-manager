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

export { fetchLogin };
