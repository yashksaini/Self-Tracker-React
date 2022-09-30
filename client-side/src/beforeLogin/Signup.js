import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import styles from "./scss/signup.module.scss";
import Axios from "axios";

const Signup = () => {
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const [valid, setvalid] = useState(true);
  const [dataerr, setdataerr] = useState("");
  Axios.defaults.withCredentials = true;
  const checkvalidusername = (value) => {
    Axios.post(`${window.server_link}/checkuser`, {
      username: value,
    }).then((result) => {
      setdataerr(result.data.length);
    });
  };
  const signup = () => {
    Axios.post(`${window.server_link}/signup`, {
      name: name,
      username: username,
      password: password,
    })
      .then(() => {
        document.getElementById("name").value = "";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        setname("");
        setusername("");
        setpassword("");
        alert("Successfully Signed Up.Please Login");
      })
      .catch((err) => {
        alert(err);
      });
  };
  useEffect(() => {
    checkform();
  }, [name, username, password, dataerr]);

  const checkform = () => {
    if (
      username.length > 5 &&
      password.length > 5 &&
      name.length > 3 &&
      dataerr === 0
    ) {
      setvalid(false);
    } else {
      setvalid(true);
    }
  };

  return (
    <div className={styles.signUp}>
      <div className={styles.signupForm}>
        <h1 className={styles.head}>SignUp</h1>
        <p className={styles.subhead}>Create account for free</p>
        <p className={styles.form_label}>
          Name <sup>*</sup>
        </p>
        <input
          type="text"
          placeholder="Name"
          className={styles.input_box}
          autoComplete="off"
          id="name"
          onChange={(ev) => {
            setname(ev.target.value);
          }}
        ></input>
        <p className={styles.form_label}>
          Username <sup>*</sup>
          <span
            className={dataerr > 0 ? `${styles.error}` : `${styles.nodisplay}`}
          >
            Username already in use
          </span>
        </p>
        <input
          type="text"
          id="username"
          autoComplete="off"
          placeholder="Create Username"
          className={
            dataerr > 0
              ? `${styles.error} ${styles.input_box}`
              : `${styles.input_box}`
          }
          onChange={(ev) => {
            setusername(ev.target.value);
            checkvalidusername(ev.target.value);
          }}
        ></input>
        <p className={styles.form_label}>
          Create Password <sup>*</sup>
        </p>
        <input
          type="password"
          id="password"
          placeholder="Create Password"
          className={styles.input_box}
          onChange={(ev) => {
            setpassword(ev.target.value);
          }}
        ></input>
        <button className={styles.submit_btn} onClick={signup} disabled={valid}>
          Create Account
        </button>
        <Link to="/login" className={styles.account}>
          Already have account? Login Here
        </Link>
      </div>
      <div className={styles.box1}></div>
      <div className={styles.box2}></div>
    </div>
  );
};

export default withRouter(Signup);
