import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
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
  dataMarksForBoardsPage,
  saveDataForBoardsPage,
  url,
}) => {
  const { request } = useHttp();
  let { id } = useParams();

  const labelMarks = dataMarksForBoardsPage.map((e, i) => {
    return (
      <div className={`board ${e.color}`} key={i}>
        <div>
          <Link to={`/boards/${id}/${e.card_id}`}>
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
              id.slice(id.length - 10),
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
