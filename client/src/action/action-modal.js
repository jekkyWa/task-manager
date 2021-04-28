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

const roleHandler = (modalRoleData) => {
  return {
    type: "ROLE_HANDLER",
    modalRoleData,
  };
};

export { modalShow, modalRoleShow, modalRoleChange, roleHandler };
