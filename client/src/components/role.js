import React from "react";

export const roleDependencies = (value, roleAndLvlHandler) => {
  const { role, level } = value;

  if (level == "Senior" && role == "Back-end developer") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Middle" && role == "Back-end developer") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Senior" && role == "Front-end developer") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Middle" && role == "Front-end developer") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Senior" && role == "QA") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Middle" && role == "QA") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Senior" && role == "Business Analyst") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Middle" && role == "Business Analyst") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Senior" && role == "UX/UI designer") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Front-end developer</option>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Middle" && role == "UX/UI designer") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Front-end developer</option>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Senior" && role == "Marketing specialist") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "Middle" && role == "Marketing specialist") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
        </select>
      </React.Fragment>
    );
  } else if (level == "god" && role == "Product manager") {
    return (
      <React.Fragment>
        <select name="role" onChange={roleAndLvlHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
          <option>Marketing specialist</option>
          <option>Product manager</option>
        </select>
        <select name="level" onChange={roleAndLvlHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </React.Fragment>
    );
  }
};
