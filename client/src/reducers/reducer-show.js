const showReducer = (state, action) => {
  if (state === undefined) {
    return {
      showUser: false,
      showSearch: false,
      showNotification: false,
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
    case "SHOW_SEARCH_BLOCK": {
      return {
        ...state.showReducer,
        showSearch: action.showSearch,
      };
    }
    default:
      return state.showReducer;
  }
};

export default showReducer;
