import React from "react";
import { useHistory } from "react-router-dom";
// files
import "./user.scss";
// redux
import { showUserBlock } from "../../../action/action-show";
import { connect } from "react-redux";
// material
import CloseIcon from "@material-ui/icons/Close";

const UserBlock = ({ logout, name, email, showUserBlock, rooms }) => {
  const history = useHistory();
  const logoutHandler = (event) => {
    event.preventDefault();
    logout();
    showUserBlock(false);
    history.push("/login");
  };

  return (
    <div className="user-block">
      <div className="header-user-block">
        <p>Account</p>
        <div className="close-user">
          <CloseIcon
            onClick={() => {
              showUserBlock(false);
            }}
            fontSize="small"
          />
        </div>
      </div>
      <div className="user-profile-block">
        <div className="user-profile-block-info">
          <h1>
            Email user: <span>{email}</span>
          </h1>
          <h1>
            Username: <span>{name}</span>
          </h1>
          <h1>
            Number of active rooms: <span>{rooms.active.length}</span>
          </h1>
          <h1>
            Number of passive rooms: <span>{rooms.passive.length}</span>
          </h1>
        </div>
      </div>
      <div className="menu-user-block">
        <h1 onClick={logoutHandler}>Go out</h1>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    showUserBlock: (showUser) => {
      dispatch(showUserBlock(showUser));
    },
  };
};

const mapStateToProps = ({
  reducerDataIdentification: { name, email, rooms },
  loginReducer: { logout },
}) => {
  return {
    logout,
    name,
    email,
    rooms,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserBlock);
