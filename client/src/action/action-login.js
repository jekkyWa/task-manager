const fetchLogin = (token, userId, login, logout, isAuthenticated) => {
  return {
    type: "FETCH_LOGIN",
    token,
    userId,
    login,
    logout,
    isAuthenticated,
  };
};

const modalShow = (show) => {
  return {
    type: "MODAL_SHOW",
    show,
  };
};

const displaySelection = (valueDisplay) => {
  return {
    type: "DISPLAY_SELECTION",
    valueDisplay,
  };
};

const recentActivity = (activData) => {
  return {
    type: "RECENT_ACTIVITY",
    activData,
  };
};

const roleForNewTask = (saveRole) => {
  return {
    type: "ROLE_FOR_NEW_TASK",
    saveRole,
  };
};

const modalRoleShow = (roleShow) => {
  return {
    type: "MODAL_ROLE_SHOW",
    roleShow,
  };
};

const modalRoleChange = (changeRole) => {
  return {
    type: "MODAL_ROLE_CHANGE",
    changeRole,
  };
};

const checkDeleteUser = (stateDelete) => {
  return {
    type: "CHECK_DELETE_USER",
    stateDelete,
  };
};

const markBoard = (marksBoard) => {
  return {
    type: "MARK_BOARD",
    marksBoard,
  };
};

export {
  fetchLogin,
  modalShow,
  displaySelection,
  recentActivity,
  roleForNewTask,
  modalRoleShow,
  modalRoleChange,
  checkDeleteUser,
  markBoard,
};
