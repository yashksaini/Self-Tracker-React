import React, { useState, useEffect } from "react";
import styles from "./scss/activity.module.scss";
import Axios from "axios";

const Category = () => {
  const [catName, setcatName] = useState("");
  const [valid, setvalid] = useState(true);
  const [dataerr, setdataerr] = useState("");
  const [cats, setcats] = useState([]);
  const [subBox, setsubBox] = useState(false);
  const [catId, setcatId] = useState("");
  const [catSubData, setcatSubData] = useState([]);
  const [leftSubData, setleftSubData] = useState([]);
  Axios.defaults.withCredentials = true;
  const discatSub = [];
  const disleftSub = [];
  if (catSubData.length > 0) {
    for (let i = 0; i < catSubData.length; i++) {
      discatSub.push(
        <div
          onClick={() => {
            remSubToCat(cats[catId].id, catSubData[i].id);
          }}
        >
          {catSubData[i].sub_name} <span className={styles.remBtn}>+</span>
        </div>
      );
    }
  } else {
    discatSub.push(<div>No Subject Added</div>);
  }
  if (leftSubData.length > 0) {
    for (let i = 0; i < leftSubData.length; i++) {
      disleftSub.push(
        <div
          onClick={() => {
            addSubToCat(cats[catId].id, leftSubData[i].id);
          }}
        >
          {leftSubData[i].sub_name} <span className={styles.addCatBtn}>+</span>
        </div>
      );
    }
  } else {
    disleftSub.push(<div>No Subject Left</div>);
  }

  // Backend Functions Start
  const checkvalidcat = (value) => {
    Axios.post(`${window.server_link}/checkcat`, {
      catName: value,
    }).then((result) => {
      setdataerr(result.data.length);
    });
  };
  const addCat = () => {
    Axios.post(`${window.server_link}/addCat`, {
      catName: catName,
    }).then(() => {
      document.getElementById("catName").value = "";
      setcatName("");
      getCats();
    });
  };

  const getCats = () => {
    Axios.get(`${window.server_link}/getCats`).then((response) => {
      // console.log("HEllo");
      setcats(response.data);
    });
  };

  const getAddedSubject = (value) => {
    const cat_id = cats[value].id;
    Axios.post(`${window.server_link}/catSubs`, {
      cat_id: cat_id,
    }).then((result) => {
      setcatSubData(result.data);
    });
    Axios.post(`${window.server_link}/leftSubs`, {
      cat_id: cat_id,
    }).then((result) => {
      setleftSubData(result.data);
    });
  };
  const addSubToCat = (cat_id, sub_id) => {
    Axios.post(`${window.server_link}/addSubToCat`, {
      sub_id: sub_id,
      cat_id: cat_id,
    }).then((result) => {
      getAddedSubject(catId);
    });
  };
  const remSubToCat = (cat_id, sub_id) => {
    Axios.post(`${window.server_link}/remSubToCat`, {
      sub_id: sub_id,
      cat_id: cat_id,
    }).then((result) => {
      getAddedSubject(catId);
    });
  };
  // Backend Function End

  const displayCats = [];
  for (let i = 0; i < cats.length; i++) {
    displayCats.push(
      <div className={styles.eachSub}>
        <button
          onClick={() => {
            addSubject(i);
            getAddedSubject(i);
          }}
        >
          <div>{i + 1}</div>
          <div>+</div>
        </button>
        <span>{cats[i].cat_name}</span>
        <button>+</button>
      </div>
    );
  }
  if (catId !== "") {
    displayCats.push(
      <div className={subBox ? `${styles.addCatBox}` : `${styles.noCatBox}`}>
        <div className={styles.box1}>
          <div className={styles.topBox}>
            <div>
              <i className="fas fa-fan"></i> {cats[catId].cat_name}
            </div>
            <button
              onClick={() => {
                setsubBox(false);
              }}
              className={styles.closeCat}
            >
              <span>+</span>
            </button>
          </div>
          <div className={styles.bodyBox}>
            <h4>
              <i className="far fa-check-circle"></i> Added Subjects (
              {catSubData.length})
            </h4>
            <div className={styles.addedCats}>{discatSub}</div>
            <h4>Subjects ({leftSubData.length})</h4>
            <div className={styles.addedCats}>{disleftSub}</div>
          </div>
        </div>
      </div>
    );
  }
  const addSubject = (value) => {
    setsubBox(true);
    setcatId(value);
  };

  const checkform = () => {
    if (catName.length > 0 && catName.length < 30 && dataerr === 0) {
      setvalid(false);
    } else {
      setvalid(true);
    }
  };
  useEffect(() => {
    getCats();
  }, []);

  useEffect(() => {
    checkform();
  }, [catName, dataerr]);

  return (
    <div className={styles.subjectBox}>
      <h1>Add Category</h1>
      <div
        className={
          dataerr > 0 || catName.length > 29
            ? `${styles.error} ${styles.addSub}`
            : `${styles.addSub}`
        }
      >
        <input
          type="text"
          id="catName"
          className={styles.input_box}
          placeholder="Add category name here..."
          autoComplete="off"
          onChange={(ev) => {
            setcatName(ev.target.value);
            checkvalidcat(ev.target.value);
          }}
        ></input>
        <span
          className={dataerr > 0 ? `${styles.error1}` : `${styles.nodisplay}`}
        >
          Category already exist.
        </span>
        <span
          className={
            catName.length > 29 ? `${styles.error1}` : `${styles.nodisplay}`
          }
        >
          Category length must less than 30
        </span>
        <button className={styles.addBtn} disabled={valid} onClick={addCat}>
          +
        </button>
      </div>
      <div className={styles.line}></div>
      <h2>
        <i className="fas fa-clipboard-list"></i> Added Categories{" "}
        <span>{cats.length}</span>
      </h2>
      {displayCats}
    </div>
  );
};

export default Category;
