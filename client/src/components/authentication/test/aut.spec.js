import React from "react";
import configureMockStore from "redux-mock-store";
// file
import RegisterContainer, { Register } from "../register/register-page";

const mockStore = configureMockStore();

const setUpRegister = (props) => shallow(<Register {...props} />);

describe("should render RegisterPage component", () => {
  let component, wrapper, store;

  it("test mapStateToProps in the RegisterPage", () => {
    const initialState = {
      loginReducer: { login: 1 },
    };
    store = mockStore(initialState);
    // Shallow render the container passing in the mock store
    wrapper = shallow(<RegisterContainer store={store} />).dive();
    expect(wrapper.props().login).toBe(1);
  });
  it("render correctly text component RegisterPage", () => {
    const component = setUpRegister();
    expect(component).toMatchSnapshot()
  });
});
