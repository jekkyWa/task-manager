const getDataReducer = (state, action) => {
  if (state === undefined) {
    return {
      email: "email",
      name: "name",
    };
  }
  switch (action.type) {
    case "SAVE_DATA_IDENT":
      return {
        email: action.email,
        name: action.name,
      };
    default:
      return state.getDataReducer;
  }
};

export default getDataReducer;
