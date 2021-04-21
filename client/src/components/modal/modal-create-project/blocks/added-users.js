import React from "react";

const AddedUsers = ({ addedUsers, setAddedUsers }) => {
  const label = addedUsers.map((element, i) => {
    const changeHandlerAddUser = (e) => {
      const id = addedUsers.findIndex((e) => e.id == element.id);
      let newItem = {
        ...addedUsers[id],
        emailOfUserToAdd:
          e.target.name == "emailOfUserToAdd"
            ? e.target.value
            : addedUsers[id].emailOfUserToAdd,
        roleOfUserToAdd:
          e.target.name == "roleOfUserToAdd"
            ? e.target.value
            : addedUsers[id].roleOfUserToAdd,
        levelOfUserToAdd:
          e.target.name == "levelOfUserToAdd"
            ? e.target.value
            : addedUsers[id].levelOfUserToAdd,
      };
      setAddedUsers([
        ...addedUsers.slice(0, id),
        newItem,
        ...addedUsers.slice(id + 1),
      ]);
    };
    return (
      <div key={element.id} className="add-user-block">
        <div className="add-user-email">
          <p>Email</p>
          <input
            id={element.id}
            name="emailOfUserToAdd"
            onChange={changeHandlerAddUser}
            placeholder="Enter the email"
          />
        </div>
        <div className="add-user-role">
          <p>Role in the project</p>
          <select
            name="roleOfUserToAdd"
            onChange={changeHandlerAddUser}
            id={element.id}
          >
            <option>Back-end developer</option>
            <option>Front-end developer</option>
            <option>QA</option>
            <option>Business Analyst</option>
            <option>UX/UI designer</option>
            <option>Marketing specialist</option>
            <option>Product manager</option>
          </select>
        </div>
        <div className="add-user-role">
          <p>Level</p>
          <select
            name="levelOfUserToAdd"
            onChange={changeHandlerAddUser}
            id={element.id}
          >
            <option>Junior</option>
            <option>Middle</option>
            <option>Senior</option>
          </select>
        </div>
        <div className="add-user-delete-btn">
          <button
            onClick={() => {
              setAddedUsers([
                ...addedUsers.slice(0, i),
                ...addedUsers.slice(i + 1),
              ]);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });
  return label;
};

export default AddedUsers;
