import React from "react";
import { Link, withRouter } from "react-router-dom";
import styles from "./scss/home.module.scss";
const Home = () => {
  return (
    <div className={styles.bHome}>
      <div className={styles.homeContent}>
        <img src="images/bars.gif"></img>
        <h1>
          <span>S</span>elf<span>t</span>raker
        </h1>
        <p>
          Track your daily activities with SelfTraker
          <br /> and get analysis
        </p>
        <Link to="/signup" className={styles.createAccount}>
          Create Free Account
        </Link>
      </div>
      <div className={`${styles.hc1} ${styles.lcircles}`}></div>
      <div className={`${styles.hc2} ${styles.lcircles}`}></div>
      <div className={`${styles.hc3} ${styles.lcircles}`}></div>
      <div className={`${styles.hc4} ${styles.lcircles}`}></div>

      <div className={`${styles.hsc1} ${styles.scircles}`}></div>
      <div className={`${styles.hsc2} ${styles.scircles}`}></div>
      <div className={`${styles.hsc3} ${styles.scircles}`}></div>
      <div className={`${styles.hsc4} ${styles.scircles}`}></div>
    </div>
  );
};

export default withRouter(Home);
