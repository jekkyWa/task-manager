const reducerState = (state, action) => {
  if (state === undefined) {
    return {
      stateDelete: false,
    };
  }
  switch (action.type) {
    case "CHECK_DELETE_USER":
      return {
        ...state.reducerState,
        stateDelete: action.stateDelete,
      };
    default:
      return state.reducerState;
  }
};

export default reducerState;
