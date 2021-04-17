function noop() {}
const initialState = {
  token: null,
  userId: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
};
const loginReducer = (state = initialState, action) => {
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
      return state;
  }
};

export default loginReducer;
