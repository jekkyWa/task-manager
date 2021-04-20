export const menuState = (id, arrId, func) => {
  if (arrId.indexOf(id) !== -1) {
    func([
      ...arrId.slice(0, arrId.indexOf(id)),
      ...arrId.slice(arrId.indexOf(id) + 1),
    ]);
  } else {
    func([...arrId, id]);
  }
};
