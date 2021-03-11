const getDataReducer = (state, action) => {
  if (state === undefined) {
    return {
      email: "email",
      name: "name",
      active_rooms: [],
      boards: [],
      card: {},
    };
  }
  switch (action.type) {
    case "SAVE_DATA_IDENT":
      return {
        ...state.getDataReducer,
        email: action.email,
        name: action.name,
        active_rooms: action.active_rooms,
      };
    case "SAVE_BOARD_DATA":
      return {
        ...state.getDataReducer,
        boards: action.boards,
      };

    case "SAVE_ACTIVITY_CARD":
      return {
        ...state.getDataReducer,
        card: action.card,
      };

    default:
      return state.getDataReducer;
  }
};

export default getDataReducer;
