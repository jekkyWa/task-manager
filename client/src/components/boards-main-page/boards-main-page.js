import React, { useEffect, useState } from "react";
import Header from "../header";
import SideBar from "../sideBar/side-bar";
import { connect } from "react-redux";
import { saveDataForBoardsPage } from "../../action/action-login";
import Loading from "../loading/loading";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import "./boards-main-page.scss";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import DashboardIcon from "@material-ui/icons/Dashboard";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

const BoardsMainPage = ({
  socket,
  email,
  saveDataForBoardsPage,
  allDataForBoardsPage,
}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (socket) {
      socket.emit("joinMainPageBoard", { email: email });
    }
  }, [email, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getDataMainPageBoard", (value) => {
        saveDataForBoardsPage(value);
        setLoading(false);
        console.log(value);
      });

      return () => socket.off("getDataMainPageBoard");
    }
  }, [socket, allDataForBoardsPage]);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  const labelMarks = allDataForBoardsPage.marks.map((e, i) => {
    return (
      <div className={`board ${e.color}`} key={e.card_id}>
        <div>
          <div className="main-link-boards">{e.name_Board}</div>
        </div>
        <div className="star-icon-boards-page">
          <h1>Take a label</h1>
          <StarRoundedIcon fontSize="small" />
        </div>
      </div>
    );
  });

  const label = allDataForBoardsPage.cards.active
    .concat(allDataForBoardsPage.cards.passive)
    .map((e, i) => {
      const labelItem = e.items.map((element, index) => {
        return (
          <div className={`board ${element.color}`} key={element.card_id}>
            <div>
              <div className="main-link-boards">{element.name_Board}</div>
            </div>
            <div className="star-icon-boards-page">
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
            <div className="btn-block-boards-main-page">
              <div>
                <DashboardIcon fontSize="small" />
                <span>Boards</span>
              </div>
              <div>
                <FavoriteBorderOutlinedIcon fontSize="small" />
                <span>Important events</span>
              </div>
              <div>
                <PeopleOutlineOutlinedIcon fontSize="small" />
                <span>Participants</span>
              </div>
              <div>
                <DeleteOutlineOutlinedIcon fontSize="small" />
                <span>Delete</span>
              </div>
            </div>
          </div>
          <div className="boards-body">{labelItem}</div>
        </React.Fragment>
      );
    });

  return (
    <div>
      <Header />
      <div className="container boards-page">
        <div>
          <SideBar />
        </div>
        <div className="body-page-container">
          <div className="boards-page-body">
            <div className="boards-page-header">
              <StarOutlineRoundedIcon />
              <h1>Marked boards</h1>
            </div>
            <div className="boards-body">{labelMarks}</div>
          </div>
          <div className="boards-page-body main-body-boards">{label}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { socket, email, allDataForBoardsPage },
}) => {
  return { socket, email, allDataForBoardsPage };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataForBoardsPage: (allDataForBoardsPage) => {
      dispatch(saveDataForBoardsPage(allDataForBoardsPage));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardsMainPage);
