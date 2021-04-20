import React from "react";
import { Link, useParams } from "react-router-dom";
// files
import { mark } from "../../utils/mark";
import { useHttp } from "../../../hooks/http.hook";
// material
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";

const BoardInCommandItem = ({
  email,
  token,
  allDataForBoardsPageBoards,
  allDataForBoardsPageMarks,
  saveDataForBoardsPage,
  url,
}) => {
  const { request } = useHttp();
  // Router
  let { id } = useParams();

  const label = allDataForBoardsPageBoards.map((element) => {
    // Check the existence of an element with an array in the database
    // const index =
    return (
      <div className={`board ${element.color}`} key={element.card_id}>
        <div>
          <Link to={`/boards/${id}/${element.card_id}`}>
            <div className="main-link-boards">
              <h1>{element.name_Board}</h1>
            </div>
          </Link>
        </div>
        <div
          className={
            allDataForBoardsPageMarks.findIndex(
              (elem) => elem.card_id == element.card_id
            ) !== -1
              ? "hidden"
              : "star-icon-boards-page"
          }
          onClick={() => {
            // Cancel boot mark for it answers bool
            mark(
              id.slice(id.length - 10),
              element.card_id,
              allDataForBoardsPageMarks,
              saveDataForBoardsPage,
              email,
              token,
              request,
              true,
              url
            );
          }}
        >
          <h1>Mark</h1>
          <StarOutlineRoundedIcon fontSize="small" />
        </div>
        <div
          className={
            allDataForBoardsPageMarks.findIndex(
              (elem) => elem.card_id == element.card_id
            ) == -1
              ? "hidden"
              : "star-icon-boards-page"
          }
          onClick={() => {
            // Cancel boot mark for it answers bool
            mark(
              id.slice(id.length - 10),
              element.card_id,
              allDataForBoardsPageMarks,
              saveDataForBoardsPage,
              email,
              token,
              request,
              false,
              url
            );
          }}
        >
          <h1>Take a label</h1>
          <StarRoundedIcon fontSize="small" />
        </div>
      </div>
    );
  });

  return label;
};

export default BoardInCommandItem;
