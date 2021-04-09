import React, { useEffect } from "react";
import Header from "../header";
import SideBar from "../sideBar/side-bar";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import "./pages.scss";
import { connect } from "react-redux";
import { saveDataIdentification } from "../../action/action-login";

const BeginningOfWorkPage = ({
  email,
  name,
  token,
  saveDataIdentification,
  socket,
}) => {
  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterDeleteUser", (value) => {
        if (
          value.board.addedUsers.findIndex((e) => e.email == email) == -1 &&
          email !== value.board.creator
        ) {
          const rooms = {
            active: value.active,
            passive: value.passive,
          };
          console.log(rooms);
          saveDataIdentification(email, name, rooms);
        }
      });
      return () => socket.off("getDataAfterDeleteUser");
    }
  }, [socket]);
  return (
    <div>
      <Header />
      <div className="container begin-page">
        <div>
          <SideBar />
        </div>
        <div className="begin-body">
          <div className="header-begin-container">
            <div className="icon-begin">
              <CheckBoxOutlinedIcon fontSize="small" />
            </div>
            <h1>Beginning of work</h1>
          </div>
          <div className="begin-container">
            <h1>Let's customize nieTask for your tasks</h1>
            <p>Follow these instructions to get the most out of nieTask.</p>
            <div className="paragraph-for-begin">
              <div className="number">1</div>
              <div>
                <h2>Create a team</h2>
                <p>Teams help coordinate teamwork.</p>
              </div>
            </div>
            <div className="paragraph-for-begin">
              <div className="number">2</div>
              <div>
                <h2>Provide a name and description for the command</h2>
                <p>Add team name and description</p>
              </div>
            </div>
            <div className="paragraph-for-begin">
              <div className="number">3</div>
              <div>
                <h2>Specify the end date of the project </h2>
                <p>Add the expected finish date of the project</p>
              </div>
            </div>
            <div className="paragraph-for-begin">
              <div className="number">4</div>
              <div>
                <h2>Invite users</h2>
                <p>Add users to your team</p>
              </div>
            </div>
            <div className="paragraph-for-begin">
              <div className="number">5</div>
              <div>
                <h2>Create a board</h2>
                <p>Create your own workflow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { name, socket, email },
  loginReducer: { token },
}) => {
  return { token, email, name, socket };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataIdentification: (email, name, rooms) => {
      dispatch(saveDataIdentification(email, name, rooms));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BeginningOfWorkPage);
