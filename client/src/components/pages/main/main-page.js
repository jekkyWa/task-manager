import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./main-page.scss";
// image
import image_1 from "../../../images/image_1.png";
import image_2 from "../../../images/card-back.svg";
import image_3 from "../../../images/hero.png";
import image_4 from "../../../images/image_4.svg";
// icons
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";
// components
import ButtonVariation from "./blocks/button-variation";

export const MainPage = ({ token }) => {
  // Verification of authorization
  const authentication = !!token;

  return (
    <div className="main-page">
      <div className="main-page-header">
        <div className="logo-block-main-page">
          <div className="logo-main-page">
            <DashboardRoundedIcon fontSize="large" />
          </div>
          <h1>Taskood</h1>
        </div>
        {/*Buttons change depending on the status of authorization */}
        <ButtonVariation aut={authentication} />
      </div>
      <div className="main-page-body container">
        <div className="block-one-main-page row">
          <div className="col-lg-7">
            <h1>Taskood helps teams effectively solve work tasks.</h1>
            <h2>
              Work in a team, manage projects and output Productivity to a new
              level by their own unique way Together with Taskood.
            </h2>
            <Link to="/signup">
              <button className="btn-register-main-page">
                Register - it's free
              </button>
            </Link>
          </div>
          <img className=" col-lg-5 card-image-one" src={image_3} />
        </div>
        <div className="block-two-main-page">
          <h1>Functions for efficient teamwork.</h1>
          <h2>
            The productivity of the team depends on effective tools and
            Comfortable working environment.Intuitive functions of Trello Allow
            the command to quickly configure workflows for any tasks: from
            meetings and projects to events and setting goals.
          </h2>
          <div>
            <img src={image_1} />
          </div>
        </div>
        <div className="block-other-main-page">
          <div>
            <h1>On cards there is everything you need.</h1>
            <h2>
              Taskood cards will help to effectively organize work: Track the
              tasks, as well as manage them and share information with Command
              participants.To see all available features - lists tasks, date of
              execution, comments on tasks and not only, open Any card.
            </h2>
          </div>
          <img src={image_2} />
        </div>
        <div className="block-other-main-page mobile-block-four">
          <img src={image_4} />
          <div>
            <h1>
              This is not just a job.This coordination of action in the team.
            </h1>
            <h2>
              Include with boards, columns and cards, and then go to more
              complex functions.
            </h2>
          </div>
        </div>
        <div className="last-info-block-main-page">
          <h1>
            Taskood is a project created exclusively for educational purposes.
          </h1>
          <div className="btn-footer-main-page">
            <a href="https://trello.com/ru">
              <button>Original</button>
            </a>
          </div>
          <h1>
            If you have not started your work in Taskood, what do you expect?
          </h1>
          <div className="btn-footer-main-page">
            <Link to="/signup">
              <button>Start work</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ loginReducer: { token } }) => {
  return { token };
};

const MainPageContainer = connect(mapStateToProps, null)(MainPage);

export default MainPageContainer;
