import getDataReducer from "./reducer-data";
import loginReducer from "./reducer-login";
import showReducer from "./reducer-show";
import reducerDataIdentification from "./reducer-data-identification";
import reducerSaveData from "./reduces-save-data";

const reducer = (state, action) => {
  return {
    reducerSaveData: reducerSaveData(state, action),
    reducerDataIdentification: reducerDataIdentification(state, action),
    showReducer: showReducer(state, action),
    getDataReducer: getDataReducer(state, action),
    loginReducer: loginReducer(state, action),
  };
};

export default reducer;
