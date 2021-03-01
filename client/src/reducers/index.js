import getDataReducer from "./reducer-data";
import loginReducer from "./reducer-login";

const reducer = (state, action) => {
  return {
    getDataReducer: getDataReducer(state, action),
    loginReducer: loginReducer(state, action),
  };
};

export default reducer;
