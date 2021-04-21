// Creating a new marked element, if true
// If the false element is removed from the list of marked items
export const mark = async (
  board_id,
  mark_board,
  allDataForBoardsPage,
  saveDataForBoardsPage,
  email,
  token,
  request,
  bool,
  url
) => {
  const value = { board_id, email, newMarkBoard: mark_board, state: bool };
  console.log(value);
  const data = await request(`/api/${url}`, "POST", value, {
    Authorization: `Bearer ${token}`,
  });
  // Saving data for the main page
  if (url == "addMarkMainBoards") {
    // Saving all received data
    saveDataForBoardsPage({
      ...allDataForBoardsPage,
      marks: data.marksCards,
    });
    // Saving data for the board in command page
  } else {
    saveDataForBoardsPage(data.marksCards);
  }
};
