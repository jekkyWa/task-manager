import reducerState from "./reducer-state";
import loginReducer from "./reducer-login";
import showReducer from "./reducer-show";
import reducerDataIdentification from "./reducer-data-identification";
import reducerSaveData from "./reduces-save-data";
import reducerModal from "./reducer-modal";

const reducer = (state, action) => {
  return {
    reducerModal: reducerModal(state, action),
    reducerSaveData: reducerSaveData(state, action),
    reducerDataIdentification: reducerDataIdentification(state, action),
    showReducer: showReducer(state, action),
    reducerState: reducerState(state, action),
    loginReducer: loginReducer(state, action),
  };
};

export default reducer;
