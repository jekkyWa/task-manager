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
  bool
) => {
  const value = { board_id, email, newMarkBoard: mark_board, state: bool };
  const data = await request("/api/addMarkMainBoards", "POST", value, {
    Authorization: `Bearer ${token}`,
  });
  console.log(data);
  // Saving all received data
  saveDataForBoardsPage({
    ...allDataForBoardsPage,
    marks: data.marksCards,
  });
};
