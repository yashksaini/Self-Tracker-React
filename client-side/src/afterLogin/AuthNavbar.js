import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./scss/authnavbar.module.scss";
import Axios from "axios";
const AuthNavbar = () => {
  const [active, setactive] = useState(1);
  const [activenav, setactivenav] = useState(1);
  Axios.defaults.withCredentials = true;
  useEffect(() => {
    const link = window.location.href;
    const part = link.split("/");
    setactivenav(part[3]);
  }, [active, activenav]);
  const showNav = () => {
    if (active === 1) {
      setactive(2);
    } else {
      setactive(1);
    }
  };
  const logout = () => {
    Axios.get(`${window.server_link}/logout`);
    window.location.reload();
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
        <a href="#" className={styles.nav_link} onClick={logout}>
          LogOut
        </a>
        <Link
          to="/selfTraker"
          className={
            activenav === "selfTraker"
              ? `${styles.nav_link} ${styles.active_nav}`
              : `${styles.nav_link}`
          }
          onClick={showNav}
        >
          Profile
        </Link>

        <Link
          to="/activity"
          className={
            activenav === "activity"
              ? `${styles.nav_link} ${styles.active_nav}`
              : `${styles.nav_link}`
          }
          onClick={showNav}
        >
          Activity
        </Link>
        <Link
          to="/today"
          className={
            activenav === "today"
              ? `${styles.nav_link} ${styles.active_nav}`
              : `${styles.nav_link}`
          }
          onClick={showNav}
        >
          Today
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

export default AuthNavbar;
