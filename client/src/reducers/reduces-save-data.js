const reducerSaveData = (state, action) => {
  if (state === undefined) {
    return {
      boards: [],
      card: {},
      socket: null,
      roleProfileInBoard: {},
      cardFull: {},
      dataToModal: {},
      boardActive: {},
      notifications: [],
      importantEvents: { board: [], card: [] },
      allDataForBoardsPage: { cards: [], marks: [] },
    };
  }
  switch (action.type) {
    case "SAVE_BOARD_DATA":
      return {
        ...state.reducerSaveData,
        boards: action.boards,
      };

    case "SAVE_ACTIVITY_CARD":
      return {
        ...state.reducerSaveData,
        card: action.card,
      };

    case "SAVE_SOCKET":
      return {
        ...state.reducerSaveData,
        socket: action.socket,
      };
    case "SAVE_ROLE":
      return {
        ...state.reducerSaveData,
        roleProfileInBoard: action.roleProfileInBoard,
      };
    case "SAVE_FULL_TASK":
      return {
        ...state.reducerSaveData,
        cardFull: action.cardFull,
      };
    case "SAVE_DATA_TO_MODAL":
      return {
        ...state.reducerSaveData,
        dataToModal: action.dataToModal,
      };
    case "SAVE_ACTIVE_BOARD":
      return {
        ...state.reducerSaveData,
        boardActive: action.boardActive,
      };
    case "SAVE_NOTIFICATIONS":
      return {
        ...state.reducerSaveData,
        notifications: action.notifications,
      };

    case "SAVE_IMPORTANT_EVENTS": {
      return {
        ...state.reducerSaveData,
        importantEvents: action.importantEvents,
      };
    }

    case "SAVE_DATA_FOR_BOARDS_PAGE": {
      return {
        ...state.reducerSaveData,
        allDataForBoardsPage: action.allDataForBoardsPage,
      };
    }
    default:
      return state.reducerSaveData;
  }
};

export default reducerSaveData;
