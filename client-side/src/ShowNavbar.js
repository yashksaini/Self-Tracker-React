import React from "react";
import AuthNavbar from "./afterLogin/AuthNavbar";
import Navbar from "./beforeLogin/Navbar";

const ShowNavbar = ({ isAuth }) => {
  if (isAuth === true) {
    return <AuthNavbar />;
  } else {
    return <Navbar />;
  }
};

export default ShowNavbar;
