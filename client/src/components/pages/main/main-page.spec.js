import React from "react";
import { MainPage } from "./main-page";

const setUp = (props) => shallow(<MainPage {...props} />);

describe("should render Post component", () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it("should contain .post wrapper", () => {
    const wrapper = component.find(".main-page");
    expect(wrapper.length).toBe(1);
  });
});
