import React from "react";

const Delete = ({ deleteTask }) => {
  return (
    <div>
      <h1>
        Deleting a task, it will be impossible to restore the data.Think again
        before deleting the task.
      </h1>
      <button
        className="delete-task"
        onClick={() => {
          deleteTask();
        }}
      >
        Delete task
      </button>
    </div>
  );
};

export default Delete;
