import React, { useEffect, useState } from "react";
import SideBar from "../sideBar/side-bar";
import Header from "../header";
import "./pages.scss";
import { connect } from "react-redux";
import { saveDataIdentification } from "../../action/action-login";
import { useHttp } from "../hooks/http.hook";
import Loading from "../loading/loading";
import io from "socket.io-client";
import { saveSocket } from "../../action/action-login";
import image_1 from "../../images/image_1.png";
import image_2 from "../../images/card-back.svg";
import image_3 from "../../images/hero.png";

const MainPage = ({ token, saveDataIdentification, saveSocket }) => {
  const phone = "192.168.43.127:5000";
  const local = "http://localhost:5000";
  const { request, loading } = useHttp();
  const setupSocket = () => {
    const newSocket = io(local, {
      query: {
        token,
      },
    });
    console.log(newSocket);
    newSocket.on("disconnect", () => {
      saveSocket(null);
      setTimeout(setupSocket, 3000);
      console.log("disconnecnt");
    });

    newSocket.on("connect", () => {
      console.log("succes");
    });

    saveSocket(newSocket);
  };

  useEffect(() => {
    setupSocket();
  }, []);

  const getData = async () => {
    try {
      const data = await request("/api/getData/test", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      saveDataIdentification(data.email, data.name, data.rooms);
    } catch (e) {}
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="main-page">
      <Header />
      <div className="container boards-page">
        <div>
          <SideBar />
        </div>
        <div className="boards-body main-page-body">
          <h1>
            <span className="name-proj-logo">NieTask</span> - Applications
            required to monitor the tasks and to facilitate project management.
          </h1>
          <h2>
            Work in a team, manage projects and output productivity To the new
            level by your own unique way with Nietask.
          </h2>
          <img src={image_1} />
          <h3>On cards there is everything you need</h3>
          <p>
            Nietask cards will help to effectively organize work: Track the
            tasks, as well as manage them and share information with Command
            participants.To see all available features - lists tasks, date of
            execution, comments on tasks and not only, open Any card.
          </p>
          <img className="card-image" src={image_2} />
          <h1>
            This is not just a job.This coordination of action in the team.
          </h1>
          <h2>
            Include with boards, columns and cards, and then go to more complex
            functions.
          </h2>
          <img className="card-image" src={image_3} />
          <h1>
            NieTask is a project created exclusively for educational purposes.
          </h1>
          <div>
            <button>Original</button>
          </div>
          <h1>
            If you have not started your work in Nietask, what do you expect?
          </h1>
          <div>
            <button>Start work</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { name },
  loginReducer: { token },
}) => {
  return { token, name };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveSocket: (socket) => {
      dispatch(saveSocket(socket));
    },
    saveDataIdentification: (email, name, rooms) => {
      dispatch(saveDataIdentification(email, name, rooms));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
