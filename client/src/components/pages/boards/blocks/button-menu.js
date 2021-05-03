import React from "react";
import { Link } from "react-router-dom";
// material
import DashboardIcon from "@material-ui/icons/Dashboard";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

const ButtonMenu = ({ name, board_id }) => {
  return (
    <div className="btn-block-boards-main-page">
      <div>
        <DashboardIcon сlassName="btn-icon-block-boards" fontSize="small" />
        <span>
          <Link to={`/boards/${name + board_id}`}>Boards</Link>
        </span>
      </div>
      <div>
        <FavoriteBorderOutlinedIcon
          сlassName="btn-icon-block-boards"
          fontSize="small"
        />
        <span>
          <Link to={`/boards/${name + board_id}/important_events`}>
            Important
          </Link>
        </span>
      </div>
      <div>
        <PeopleOutlineOutlinedIcon
          сlassName="btn-icon-block-boards"
          fontSize="small"
        />
        <span>
          <Link to={`/boards/${name + board_id}/participants`}>
            Participants
          </Link>
        </span>
      </div>
    </div>
  );
};

export default ButtonMenu;
