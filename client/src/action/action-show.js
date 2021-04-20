const showUserBlock = (showUser) => {
  return {
    type: "SHOW_USER_BLOCK",
    showUser,
  };
};

const showSearchBlock = (showSearch) => {
  return {
    type: "SHOW_SEARCH_BLOCK",
    showSearch,
  };
};

const showNotifications = (showNotification) => {
  return {
    type: "SHOW_NOTIFICATIONS",
    showNotification,
  };
};

export { showUserBlock, showSearchBlock, showNotifications };
