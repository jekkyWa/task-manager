import React from "react";
import "./menu.scss";
import CloseIcon from "@material-ui/icons/Close";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import PhotoSizeSelectActualOutlinedIcon from "@material-ui/icons/PhotoSizeSelectActualOutlined";
import AssignmentLateOutlinedIcon from "@material-ui/icons/AssignmentLateOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';

const Menu = ({ onHide }) => {
  return (
    <div className="menu">
      <div className="menu-logo">
        <div className="menu-icon">
          <h1>Меню</h1>
        </div>
        <div className="menu-close">
          <div>
            <CloseIcon fontSize="small" onClick={() => onHide()} />
          </div>
        </div>
      </div>
      <div className="menu-item">
        <div>
          <InfoOutlinedIcon />
        </div>
        <h1>О доске</h1>
      </div>
      <div className="menu-item">
        <div>
          <PhotoSizeSelectActualOutlinedIcon />
        </div>
        <h1> Сменить фон</h1>
      </div>
      <div className="menu-item">
        <div>
          <AssignmentLateOutlinedIcon />
        </div>
        <h1> Показать только доступные задания</h1>
      </div>
      <div className="menu-item">
        <div>
          <AssignmentOutlinedIcon />
        </div>
        <h1> Показать все задания</h1>
      </div>
      <div className="menu-item">
        <div>
          <AssignmentTurnedInOutlinedIcon />
        </div>
        <h1> Созданные задания</h1>
      </div>
      <div className="menu-item">
        <div>
          <AssignmentIndOutlinedIcon />
        </div>
        <h1>Мои задания</h1>
      </div>
      <hr />
      <div className="menu-recent-activity">
        <div>
          <FormatListBulletedIcon />
        </div>
        <h1> Последние действия</h1>
      </div>
    </div>
  );
};

export default Menu;
