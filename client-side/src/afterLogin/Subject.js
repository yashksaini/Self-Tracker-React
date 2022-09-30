import React, { useState, useEffect } from "react";
import styles from "./scss/activity.module.scss";
import Axios from "axios";

const Subject = () => {
  const [subName, setsubName] = useState("");
  const [valid, setvalid] = useState(true);
  const [dataerr, setdataerr] = useState("");
  const [subject, setsubject] = useState([]);
  const [catBox, setcatBox] = useState(false);
  const [subId, setsubId] = useState("");
  const [subCatData, setsubCatData] = useState([]);
  const [leftCatData, setleftCatData] = useState([]);
  Axios.defaults.withCredentials = true;
  const dissubCat = [];
  const disleftCat = [];
  if (subCatData.length > 0) {
    for (let i = 0; i < subCatData.length; i++) {
      dissubCat.push(
        <div
          onClick={() => {
            remCatToSub(subject[subId].id, subCatData[i].id);
          }}
        >
          {subCatData[i].cat_name} <span className={styles.remBtn}>+</span>
        </div>
      );
    }
  } else {
    dissubCat.push(<div>No Category Added</div>);
  }
  if (leftCatData.length > 0) {
    for (let i = 0; i < leftCatData.length; i++) {
      disleftCat.push(
        <div
          onClick={() => {
            addCatToSub(subject[subId].id, leftCatData[i].id);
          }}
        >
          {leftCatData[i].cat_name} <span className={styles.addCatBtn}>+</span>
        </div>
      );
    }
  } else {
    disleftCat.push(<div>No Category Left</div>);
  }
  // functions for backend start
  const checkvalidsbuject = (value) => {
    Axios.post(`${window.server_link}/checksubject`, {
      subName: value,
    }).then((result) => {
      setdataerr(result.data.length);
    });
  };
  const addSubject = () => {
    Axios.post(`${window.server_link}/addSubject`, {
      subName: subName,
    }).then(() => {
      document.getElementById("subName").value = "";
      setsubName("");
      getSubjects();
    });
  };

  const getSubjects = () => {
    Axios.get(`${window.server_link}/getSubjects`).then((response) => {
      setsubject(response.data);
    });
  };

  const getAddedCategory = (value) => {
    const sub_id = subject[value].id;
    Axios.post(`${window.server_link}/subCats`, {
      sub_id: sub_id,
    }).then((result) => {
      setsubCatData(result.data);
    });
    Axios.post(`${window.server_link}/leftCats`, {
      sub_id: sub_id,
    }).then((result) => {
      setleftCatData(result.data);
    });
  };
  const addCatToSub = (sub_id, cat_id) => {
    Axios.post(`${window.server_link}/addCatToSub`, {
      sub_id: sub_id,
      cat_id: cat_id,
    }).then((result) => {
      getAddedCategory(subId);
    });
  };
  const remCatToSub = (sub_id, cat_id) => {
    Axios.post(`${window.server_link}/remCatToSub`, {
      sub_id: sub_id,
      cat_id: cat_id,
    }).then((result) => {
      getAddedCategory(subId);
    });
  };
  // Backend function ends
  const checkform = () => {
    if (subName.length > 0 && subName.length < 30 && dataerr === 0) {
      setvalid(false);
    } else {
      setvalid(true);
    }
  };
  const displayUsers = [];
  for (let i = 0; i < subject.length; i++) {
    let a = [];
    if (subject[i].streak !== null) {
      a.push(<p className={styles.streak}>{subject[i].streak}</p>);
    }
    displayUsers.push(
      <div className={styles.eachSub}>
        <button
          onClick={() => {
            addCategory(i);
            getAddedCategory(i);
          }}
        >
          <div>{i + 1}</div>
          <div>+</div> {a}
        </button>
        <span>{subject[i].sub_name}</span>
        <button>+</button>
      </div>
    );
  }
  if (subId !== "") {
    displayUsers.push(
      <div className={catBox ? `${styles.addCatBox}` : `${styles.noCatBox}`}>
        <div className={styles.box1}>
          <div className={styles.topBox}>
            <div>
              <i className="fas fa-fan"></i> {subject[subId].sub_name}
            </div>
            <button
              onClick={() => {
                setcatBox(false);
              }}
              className={styles.closeCat}
            >
              <span>+</span>
            </button>
          </div>
          <div className={styles.bodyBox}>
            <h4>
              <i className="far fa-check-circle"></i> Added Categories (
              {subCatData.length})
            </h4>
            <div className={styles.addedCats}>{dissubCat}</div>
            <h4>Categories ({leftCatData.length})</h4>
            <div className={styles.addedCats}>{disleftCat}</div>
          </div>
        </div>
      </div>
    );
  }

  const addCategory = (value) => {
    setcatBox(true);
    setsubId(value);
  };

  useEffect(() => {
    getSubjects();
  }, [subName]);

  useEffect(() => {
    checkform();
  }, [subName, dataerr]);

  return (
    <div className={styles.subjectBox}>
      <h1>Add Subject</h1>
      <div
        className={
          dataerr > 0 || subName.length > 29
            ? `${styles.error} ${styles.addSub}`
            : `${styles.addSub}`
        }
      >
        <input
          type="text"
          id="subName"
          autoComplete="off"
          className={styles.input_box}
          placeholder="Add subject name here..."
          onChange={(ev) => {
            setsubName(ev.target.value);
            checkvalidsbuject(ev.target.value);
          }}
        ></input>
        <span
          className={dataerr > 0 ? `${styles.error1}` : `${styles.nodisplay}`}
        >
          Subject already exist.
        </span>
        <span
          className={
            subName.length > 29 ? `${styles.error1}` : `${styles.nodisplay}`
          }
        >
          Subject length must less than 30
        </span>
        <button className={styles.addBtn} disabled={valid} onClick={addSubject}>
          +
        </button>
      </div>
      <div className={styles.line}></div>
      <h2>
        <i className="fas fa-clipboard-list"></i> Added Subjects{" "}
        <span>{subject.length}</span>
      </h2>
      {displayUsers}
    </div>
  );
};

export default Subject;
