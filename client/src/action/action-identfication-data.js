const saveDataIdentification = (email, name, rooms) => {
  return {
    type: "SAVE_DATA_IDENT",
    email,
    name,
    rooms,
  };
};

export { saveDataIdentification };
