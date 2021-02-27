import loginReducer from "./reducer-login";

const reducer = (state, action) => {
    return {
        loginReducer: loginReducer(state,action)
    };
};

export default reducer;
