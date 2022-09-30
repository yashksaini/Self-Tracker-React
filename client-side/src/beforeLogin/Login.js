import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import styles from "./scss/signup.module.scss";
import Axios from "axios";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [valid, setvalid] = useState(true);
  const [dataerr, setdataerr] = useState("");

  Axios.defaults.withCredentials = true;
  const login = () => {
    Axios.post(`${window.server_link}/login`, {
      username: username,
      password: password,
    })
      .then((response) => {
        console.log(response, "Logged In");
        if (response.data && response.data !== null) {
          document.getElementById("username").value = "";
          document.getElementById("password").value = "";
          setusername("");
          setpassword("");
          window.location.reload();
        } else {
          alert("Password is incorrect");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  const checkvalidusername = (value) => {
    Axios.post(`${window.server_link}/checkuser`, {
      username: value,
    }).then((result) => {
      setdataerr(result.data.length);
    });
  };

  useEffect(() => {
    checkform();
  }, [username, password]);

  const checkform = () => {
    if (username.length > 5 && password.length > 5 && dataerr === 1) {
      setvalid(false);
    } else {
      setvalid(true);
    }
  };

  return (
    <div className={styles.signUp}>
      <div className={styles.signupForm}>
        <h1 className={styles.head}>Login</h1>
        <p className={styles.subhead}>Login to start using</p>
        <p className={styles.form_label}>
          Username <sup>*</sup>
          <span
            className={
              dataerr === 0 && username.length > 5
                ? `${styles.error}`
                : `${styles.nodisplay}`
            }
          >
            Invalid Username
          </span>
        </p>
        <input
          type="text"
          id="username"
          autoComplete="off"
          placeholder="Username"
          className={
            (dataerr === 0 && username.length > 5) > 0
              ? `${styles.error} ${styles.input_box}`
              : `${styles.input_box}`
          }
          onChange={(ev) => {
            setusername(ev.target.value);
            checkvalidusername(ev.target.value);
          }}
        ></input>
        <p className={styles.form_label}>
          Password <sup>*</sup>
        </p>
        <input
          type="password"
          id="password"
          placeholder="Password"
          className={styles.input_box}
          onChange={(ev) => {
            setpassword(ev.target.value);
          }}
        ></input>
        <button className={styles.submit_btn} disabled={valid} onClick={login}>
          Login
        </button>
        <Link to="/signup" className={styles.account}>
          Don't have account? Create here.
        </Link>
      </div>
      <div className={styles.box1}></div>
      <div className={styles.box2}></div>
    </div>
  );
};

export default withRouter(Login);
