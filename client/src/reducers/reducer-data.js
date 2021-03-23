const getDataReducer = (state, action) => {
  if (state === undefined) {
    return {
      email: "email",
      name: "name",
      rooms: { active: [], passive: [] },
      boards: [],
      card: {},
      cardFull: {},
      socket: null,
      roleProfileInBoard: {},
      dataToModal: {},
      valueDisplay: { valueDisp: {}, stateFilter: true },
      show: false,
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

    case "SAVE_SOCKET":
      return {
        ...state.getDataReducer,
        socket: action.socket,
      };
    case "SAVE_ROLE":
      return {
        ...state.getDataReducer,
        roleProfileInBoard: action.roleProfileInBoard,
      };
    case "SAVE_FULL_TASK":
      return {
        ...state.getDataReducer,
        cardFull: action.cardFull,
      };
    case "SAVE_DATA_TO_MODAL":
      return {
        ...state.getDataReducer,
        dataToModal: action.dataToModal,
      };
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
    default:
      return state.getDataReducer;
  }
};

export default getDataReducer;
