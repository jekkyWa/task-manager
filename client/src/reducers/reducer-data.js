const getDataReducer = (state, action) => {
  if (state === undefined) {
    return {
      email: "email",
      name: "name",
      active_rooms: [],
    };
  }
  switch (action.type) {
    case "SAVE_DATA_IDENT":
      return {
        email: action.email,
        name: action.name,
        active_rooms: action.active_rooms,
      };
    default:
      return state.getDataReducer;
  }
};

export default getDataReducer;
