const reducerModal = (state, action) => {
  if (state === undefined) {
    return {
      show: false,
      roleShow: false,
      changeRole: false,
      modalRoleData: [],
    };
  }
  switch (action.type) {
    case "MODAL_SHOW":
      return {
        ...state.reducerModal,
        show: action.show,
      };
    case "MODAL_ROLE_SHOW":
      return {
        ...state.reducerModal,
        roleShow: action.roleShow,
      };
    case "MODAL_ROLE_CHANGE":
      return {
        ...state.reducerModal,
        changeRole: action.changeRole,
      };
    case "ROLE_HANDLER":
      return {
        ...state.reducerModal,
        modalRoleData: action.modalRoleData,
      };
    default:
      return state.reducerModal;
  }
};

export default reducerModal;
