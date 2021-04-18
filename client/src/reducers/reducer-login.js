function noop() {}
const loginReducer = (state, action) => {
  if (state === undefined) {
    return {
      token: null,
      userId: null,
      login: noop,
      logout: noop,
      isAuthenticated: false,
    };
  }
  switch (action.type) {
    case "FETCH_LOGIN":
      return {
        token: action.token,
        userId: action.userId,
        login: action.login,
        logout: action.logout,
        isAuthenticated: action.isAuthenticated,
      };
    default:
      return state.loginReducer;
  }
};

export default loginReducer;
