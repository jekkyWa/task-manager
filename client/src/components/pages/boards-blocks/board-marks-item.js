import React from "react";
import { Link } from "react-router-dom";
// files
import "./boards-main-page.scss";
import { mark } from "../utils/mark";
import { useHttp } from "../../hooks/http.hook";
// material
import StarRoundedIcon from "@material-ui/icons/StarRounded";

const BoardMarkItem = ({
  email,
  token,
  allDataForBoardsPage,
  saveDataForBoardsPage,
  url,
}) => {
  const { request } = useHttp();

  const labelMarks = allDataForBoardsPage.map((e, i) => {
    return (
      <div className={`board ${e.color}`} key={i}>
        <div>
          <Link to={`/boards/${e.name + e.board_id}/${e.card_id}`}>
            <div className="main-link-boards">
              <h1>{e.name_Board}</h1>
            </div>
          </Link>
        </div>
        <div
          className="star-icon-boards-page"
          onClick={() => {
            // Cancel boot mark for it answers bool
            mark(
              e.board_id,
              e.card_id,
              allDataForBoardsPage,
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
  return labelMarks;
};

export default BoardMarkItem;
