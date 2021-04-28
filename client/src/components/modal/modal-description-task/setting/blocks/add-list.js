import React from "react";

const AddList = ({addList}) => {
  return (
    <div>
      <h1>
        Add a check list for more convenient task management. Slide one task for
        a few small! When pressing the page is repeated re-create.
      </h1>
      <button
        onClick={() => {
          addList(true);
        }}
      >
        Add
      </button>
    </div>
  );
};

export default AddList;
