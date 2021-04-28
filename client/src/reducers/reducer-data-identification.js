const reducerDataIdentification = (state, action) => {
  if (state === undefined) {
    return {
      email: "email",
      name: "name",
      rooms: { active: [], passive: [], update: false },
    };
  }
  switch (action.type) {
    case "SAVE_DATA_IDENT":
      return {
        ...state.reducerDataIdentification,
        email: action.email,
        name: action.name,
        rooms: action.rooms,
      };
    default:
      return state.reducerDataIdentification;
  }
};

export default reducerDataIdentification;
