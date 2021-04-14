import React, { useEffect, useState } from "react";
import Header from "../header";
import SideBar from "../sideBar/side-bar";
import { connect } from "react-redux";
import { saveDataForBoardsPage, markBoard } from "../../action/action-login";
import Loading from "../loading/loading";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import "./boards-main-page.scss";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import DashboardIcon from "@material-ui/icons/Dashboard";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { Link } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";

const BoardsMainPage = ({
  socket,
  email,
  saveDataForBoardsPage,
  allDataForBoardsPage,
  markBoard,
  token,
}) => {
  const { request } = useHttp();

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
    const mark = async (bool) => {
      const board_id = e.board_id;
      const newMarkBoard = e.card_id;
      const value = { board_id, email, newMarkBoard, state: bool };
      const data = await request("/api/addMarkMainBoards", "POST", value, {
        Authorization: `Bearer ${token}`,
      });
      saveDataForBoardsPage({
        ...allDataForBoardsPage,
        marks: data.marksCards,
      });
    };
    return (
      <div className={`board ${e.color}`} key={i}>
        <div>
          <Link to={`/boards/${e.name + e.board_id}/${e.card_id}`}>
            <div className="main-link-boards">{e.name_Board}</div>
          </Link>
        </div>
        <div
          className="star-icon-boards-page"
          onClick={() => {
            mark(false);
          }}
        >
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
        const mark = async (bool) => {
          const board_id = e.board_id;
          const newMarkBoard = element.card_id;
          const value = { board_id, email, newMarkBoard, state: bool };
          const data = await request("/api/addMarkMainBoards", "POST", value, {
            Authorization: `Bearer ${token}`,
          });

          saveDataForBoardsPage({
            ...allDataForBoardsPage,
            marks: data.marksCards,
          });
        };
        return (
          <div className={`board ${element.color}`} key={element.card_id}>
            <div>
              <Link to={`/boards/${e.name + e.board_id}/${element.card_id}`}>
                <div className="main-link-boards">{element.name_Board}</div>
              </Link>
            </div>
            <div
              className={
                allDataForBoardsPage.marks.findIndex(
                  (elem) => elem.card_id == element.card_id
                ) !== -1
                  ? "hidden"
                  : "star-icon-boards-page"
              }
              onClick={() => {
                mark(true);
              }}
            >
              <h1>Mark</h1>
              <StarOutlineRoundedIcon fontSize="small" />
            </div>
            <div
              className={
                allDataForBoardsPage.marks.findIndex(
                  (elem) => elem.card_id == element.card_id
                ) == -1
                  ? "hidden"
                  : "star-icon-boards-page"
              }
              onClick={() => {
                mark(false);
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
            <div className="btn-block-boards-main-page">
              <div>
                <DashboardIcon fontSize="small" />
                <span>
                  <Link to={`/boards/${e.name + e.board_id}`}>Boards</Link>
                </span>
              </div>
              <div>
                <FavoriteBorderOutlinedIcon fontSize="small" />
                <span>
                  <Link to={`/boards/${e.name + e.board_id}/important_events`}>
                    Important events
                  </Link>
                </span>
              </div>
              <div>
                <PeopleOutlineOutlinedIcon fontSize="small" />
                <span>
                  <Link to={`/boards/${e.name + e.board_id}/participants`}>
                    Participants
                  </Link>
                </span>
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
  loginReducer: { token },
  getDataReducer: { socket, email, allDataForBoardsPage },
}) => {
  return { socket, email, allDataForBoardsPage, token };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataForBoardsPage: (allDataForBoardsPage) => {
      dispatch(saveDataForBoardsPage(allDataForBoardsPage));
    },
    markBoard: (marksBoard) => {
      dispatch(markBoard(marksBoard));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardsMainPage);
