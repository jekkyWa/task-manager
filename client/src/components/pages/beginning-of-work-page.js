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
            <h1>Teams:</h1>
            <h2>
              To start work, you need to create your team or Join the existing
              team.
            </h2>
            <h2>
              When creating a board, add users and their role, description and
              An approximate date of completion of the project.
            </h2>
            <h2>
              The management of participants occurs in the column "Participants"
              (change role, level, removal and addition new member).
            </h2>
            <h2>
              Recent activities on the board are displayed in the "Important
              column Events".
            </h2>
            <h1>Boards:</h1>
            <h2>
              After joining or creating a command, add the board, or Discover
              the planned board already available.
            </h2>
            <h2>
              Important boards can be labeled to have quick access to them.
            </h2>
            <h2>
              After performing the functions of the board, if you have the right
              rights, You can close the board.
            </h2>
            <h2>Create a board can only Product Manager. </h2>
            <h1>Tasks:</h1>
            <h2>
              After you have chosen the necessary board, go through it, and
              Create your first task, or take it.The tasks are divided by roles
              and by level of users.User level and task Showed above.
            </h2>
            <h2>
              If you created a task, add a description to it, or scatter The
              task of the subtasks, follow it by another the user after the task
              is executed, it can be found In the menu column with performed
              tasks.
            </h2>
            <h2>
              If you have taken a task, you can specify about its execution in
              comments, after execution, complete the task by clicking
              corresponding button.
            </h2>
            <h2>
              You can also display only those tasks that you can take. Or show
              all tasks that are present on the board.
            </h2>
            <h2>
              For convenience, there are columns with the tasks you created and
              taken tasks.
            </h2>
            <h2>
              A new card can only create Product Manager or User with Senior
              level.
            </h2>
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
