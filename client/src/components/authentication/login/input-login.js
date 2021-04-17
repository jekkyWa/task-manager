const InputLogin = ({ type, func }) => {
  return (
    <div className={type}>
      <input
        name={type}
        type={type}
        placeholder={`Please enter your ${type}`}
        onChange={func}
      />
    </div>
  );
};

export default InputLogin;
