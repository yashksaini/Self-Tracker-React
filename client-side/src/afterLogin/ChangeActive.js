import React from "react";
import Category from "./Category";
import Subject from "./Subject";

const ChangeActive = ({ change }) => {
  if (change === true) {
    return <Subject />;
  } else if (change === false) {
    return <Category />;
  }
};

export default ChangeActive;
