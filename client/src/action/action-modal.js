const modalShow = (show) => {
  return {
    type: "MODAL_SHOW",
    show,
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

export { modalShow, modalRoleShow, modalRoleChange };
