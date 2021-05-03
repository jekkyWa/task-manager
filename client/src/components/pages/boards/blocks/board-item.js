import React from "react";
import { Link } from "react-router-dom";
// files
import { useHttp } from "../../../hooks/http.hook";
import "../../boards-blocks/boards-main-page.scss";
// material
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import ButtonMenu from "./button-menu";
import EmptyHandlerBoard from "./empty-handler-board";

const BoardItem = ({
  email,
  token,
  allDataForBoardsPage,
  saveDataForBoardsPage,
  url,
  mark,
}) => {
  const { request } = useHttp();

  const label = allDataForBoardsPage.cards.active
    .concat(allDataForBoardsPage.cards.passive)
    .map((e, i) => {
      const labelItem = e.items.map((element) => {
        // Check the existence of an element with an array in the database
        const index = allDataForBoardsPage.marks.findIndex(
          (elem) => elem.card_id == element.card_id
        );
        return (
          <div className={`board ${element.color}`} key={element.card_id}>
            <div>
              <Link to={`/boards/${e.name + e.board_id}/${element.card_id}`}>
                <div className="main-link-boards">
                  <h1>{element.name_Board}</h1>
                </div>
              </Link>
            </div>
            <div
              className={index !== -1 ? "hidden" : "star-icon-boards-page"}
              onClick={() => {
                // Cancel boot mark for it answers bool
                mark(
                  e.board_id,
                  element.card_id,
                  allDataForBoardsPage,
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
              className={index == -1 ? "hidden" : "star-icon-boards-page"}
              onClick={() => {
                // Cancel boot mark for it answers bool
                mark(
                  e.board_id,
                  element.card_id,
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
      return (
        <React.Fragment key={i}>
          <div className="boards-main-page-header">
            <div className="logo-team-boards-main-page">
              <PersonOutlineOutlinedIcon />
              <h1>Team: {e.name}</h1>
            </div>
            <ButtonMenu name={e.name} board_id={e.board_id} />
          </div>
          <EmptyHandlerBoard labelItem={labelItem} />
        </React.Fragment>
      );
    });
  return label;
};

export default BoardItem;
