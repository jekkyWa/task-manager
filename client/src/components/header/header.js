import React, { useEffect } from "react";
import "./header.scss";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useHttp } from "../hooks/http.hook";
import { saveDataIdentification } from "../../action/action-login";

const Header = ({ saveDataIdentification, email, name, logout, token }) => {
  const history = useHistory();

  const logoutHandler = (event) => {
    event.preventDefault();
    logout();
    history.push("/login");
  };

  const { request, loading } = useHttp();

  const getData = async () => {
    try {
      const data = await request("/api/getData/test", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      console.log(data);
      saveDataIdentification(data.email, data.name);
    } catch (e) {}
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <div>load</div>;
  }

  return (
    <div className="header container-fluid">
      <div className="row">
        <div className="col-4 item-header">
          <h1>nieTask</h1>
        </div>
        <div className="col-4 item-header-input">
          <input
            placeholder="Search and filter projects"
            className="search-input"
          />
        </div>
        <div className="col-4 item-header-email">
          <p onClick={logoutHandler}>{email}</p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { email, name },
  loginReducer: { logout, userId, token },
}) => {
  return { email, name, logout, userId, token };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataIdentification: (email, name) => {
      dispatch(saveDataIdentification(email, name));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
