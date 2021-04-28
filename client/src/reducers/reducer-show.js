const showReducer = (state, action) => {
  if (state === undefined) {
    return {
      showUser: false,
      showNotification: false,
      showMenu: false,
    };
  }
  switch (action.type) {
    case "SHOW_NOTIFICATIONS": {
      return {
        ...state.showReducer,
        showNotification: action.showNotification,
      };
    }
    case "SHOW_USER_BLOCK": {
      return {
        ...state.showReducer,
        showUser: action.showUser,
      };
    }
    case "SHOW_MENU_FUNC": {
      return {
        ...state.showReducer,
        showMenu: action.showMenu,
      };
    }
    default:
      return state.showReducer;
  }
};

export default showReducer;
