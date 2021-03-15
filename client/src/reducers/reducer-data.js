const getDataReducer = (state, action) => {
  if (state === undefined) {
    return {
      email: "email",
      name: "name",
      rooms: {active: [], passive: [] },
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
        rooms: action.rooms,
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
