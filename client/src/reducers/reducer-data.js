const getDataReducer = (state, action) => {
  if (state === undefined) {
    return {
      valueDisplay: { valueDisp: {}, stateFilter: true },
      show: false,
      roleShow: false,
      changeRole: false,
      activData: [],
      saveRole: [],
      stateDelete: false,
      marksBoard: [],
    };
  }
  switch (action.type) {
    case "MODAL_SHOW":
      return {
        ...state.getDataReducer,
        show: action.show,
      };
    case "DISPLAY_SELECTION":
      return {
        ...state.getDataReducer,
        valueDisplay: action.valueDisplay,
      };
    case "RECENT_ACTIVITY":
      return {
        ...state.getDataReducer,
        activData: action.activData,
      };
    case "ROLE_FOR_NEW_TASK":
      return {
        ...state.getDataReducer,
        saveRole: action.saveRole,
      };
    case "MODAL_ROLE_SHOW":
      return {
        ...state.getDataReducer,
        roleShow: action.roleShow,
      };
    case "MODAL_ROLE_CHANGE":
      return {
        ...state.getDataReducer,
        changeRole: action.changeRole,
      };

    case "CHECK_DELETE_USER":
      return {
        ...state.getDataReducer,
        stateDelete: action.stateDelete,
      };

    case "MARK_BOARD": {
      return {
        ...state.getDataReducer,
        marksBoard: action.marksBoard,
      };
    }

    default:
      return state.getDataReducer;
  }
};

export default getDataReducer;
