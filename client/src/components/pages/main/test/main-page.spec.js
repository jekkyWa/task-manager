import React from "react";
import configureMockStore from "redux-mock-store";
// file
import MainPageContainer, { MainPage } from "../main-page.js";
import ButtonVariation from "../utils/button-variation";

const mockStore = configureMockStore();

const setUpMainPage = (props) => shallow(<MainPage {...props} />);
const setUpButtonVariation = (props) => shallow(<ButtonVariation {...props} />);

describe("should render MainPage component", () => {
  let component, wrapper, store;

  it("test mapStateToProps in the MainPage", () => {
    const initialState = {
      loginReducer: { token: "testToken" },
    };
    store = mockStore(initialState);
    // Shallow render the container passing in the mock store
    wrapper = shallow(<MainPageContainer store={store} />).dive();
    expect(wrapper.props().token).toBe("testToken");
  });
  it("should contain .main-page wrapper", () => {
    component = setUpMainPage();
    const wrapper = component.find(".main-page");
    expect(wrapper.length).toBe(1);
  });
  it("should contain .btn-to-the-boards wrapper", () => {
    const aut = true;
    component = setUpButtonVariation({ aut });
    const wrapper = component.find(".btn-to-the-boards");
    expect(wrapper.length).toBe(1);
  });
  it("should contain .btns-header-main-page wrapper", () => {
    const aut = false;
    component = setUpButtonVariation({ aut });
    const wrapper = component.find(".btns-header-main-page");
    expect(wrapper.length).toBe(1);
  });
});
