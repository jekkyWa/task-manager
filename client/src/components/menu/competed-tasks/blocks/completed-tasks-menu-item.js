import React from "react";

const CompletedTasksMenuItem = ({ value, component, findCompletedTask }) => {
  return (
    <li
      onClick={() => {
        findCompletedTask(value);
      }}
    >
      <div>{component}</div>
      <h1>{value}</h1>
    </li>
  );
};

export default CompletedTasksMenuItem;
