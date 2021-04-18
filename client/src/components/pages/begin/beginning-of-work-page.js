import React from "react";
import Header from "../../header";
import SideBar from "../../sideBar/side-bar";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import "./beginning-of-work-page.scss";

const BeginningOfWorkPage = () => {
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
            <h1>Getting started</h1>
            <h2>
              1) To get started, you need to create your own team or join an
              existing one.
            </h2>
            <h2>2) Next, create your first board, and specify its name.</h2>
            <h2>
              3) After creating the board, click on it, and you will see a
              workspace where you can create cards and add tasks to them.
            </h2>
            <h2>
              4) Create your first card and add a task (Specify the roles to
              complete the task)
            </h2>
            <h2>
              5) Monitor the progress of the task. The progress is shown in the
              window that appears after you click on the task or in the menu on
              the right of the workspace.
            </h2>
            <h3>Good luck!)</h3>
            <h1>Teams:</h1>
            <h2>
              - The team is managed in the "Participants" tab. There you can
              track how many members are in the team at the moment. You can
              change the role or level up a member, or remove them from the
              team.
            </h2>
            <h2>
              - You can track the latest changes in the team in the "Important
              events" tab. It shows the following activities: "Cancel the
              invitation", "User joined the team", "Create a new card", " Take a
              task","Task completion", "Task comments", "Checklist status",
              "Adding a new task" , etc.
            </h2>
            <h2>- You can also delete or exit the command.</h2>
            <h1>Boards:</h1>
            <h2>
              - Important boards can be labeled to have quick access to them.
            </h2>
            <h2>
              - After performing the functions of the board, if you have the
              right rights, You can close the board.
            </h2>
            <h2>- Create a board can only Product Manager. </h2>
            <h1>Tasks:</h1>
            <h2>
              - The tasks are divided by roles and by level of users.User level
              and task Showed above.
            </h2>
            <h2>
              - If you created a task, add a description to it, or scatter The
              task of the subtasks, follow it by another the user after the task
              is executed, it can be found In the menu column with performed
              tasks.
            </h2>
            <h2>
              - If you have taken a task, you can specify about its execution in
              comments, after execution, complete the task by clicking
              corresponding button.
            </h2>
            <h2>
              - You can also display only those tasks that you can take. Or show
              all tasks that are present on the board.
            </h2>
            <h2>
              - For convenience, there are columns with the tasks you created
              and taken tasks.
            </h2>
            <h2>
              - A new card can only create Product Manager or User with Senior
              level.
            </h2>
            <h1>Roles:</h1>
            <h2>- Back-end developer</h2>
            <h2>- Front-end developer</h2>
            <h2>- QA</h2>
            <h2>- Business Analyst</h2>
            <h2>- UX/UI designer</h2>
            <h2>- Marketing specialist</h2>
            <h2>- Product manager</h2>
            <h1>Level:</h1>
            <h2>- Junior</h2>
            <h2>- Middle</h2>
            <h2>- Senior</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginningOfWorkPage;
