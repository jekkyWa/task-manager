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

const showMenuFunc = (showMenu) => {
  return {
    type: "SHOW_MENU_FUNC",
    showMenu,
  };
};

export { showUserBlock, showSearchBlock, showNotifications, showMenuFunc };
