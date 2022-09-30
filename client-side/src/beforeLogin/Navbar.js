import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./scss/navbar.module.scss";
const Navbar = () => {
  const [active, setactive] = useState(1);
  const showNav = () => {
    if (active === 1) {
      setactive(2);
    } else {
      setactive(1);
    }
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <img src="images/slogo.png" alt=""></img>
        <p>
          <span>S</span>elf<span>t</span>racker
        </p>
      </div>
      <div className={active === 1 ? `${styles.navs}` : `${styles.full_nav}`}>
        <Link to="/" className={styles.nav_link} onClick={showNav}>
          Home
        </Link>
        <Link to="/signup" className={styles.nav_link} onClick={showNav}>
          SignUp
        </Link>
        <Link to="/login" className={styles.nav_link} onClick={showNav}>
          Login
        </Link>
        <div className={styles.menu_btn} onClick={showNav}>
          <div
            className={
              active === 1 ? `${styles.nav_line1}` : `${styles.dnav_line1}`
            }
          ></div>
          <div
            className={
              active === 1 ? `${styles.nav_line2}` : `${styles.dnav_line2}`
            }
          ></div>
          <div
            className={
              active === 1 ? `${styles.nav_line3}` : `${styles.dnav_line3}`
            }
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
