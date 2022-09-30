import React, { useState, useEffect } from "react";
import styles from "./scss/profile.module.scss";
import Axios from "axios";
import { Switch, Route, withRouter } from "react-router-dom";

const SelfTraker = () => {
  const [filterType, setfilterType] = useState("true");
  const [selectText, setselectText] = useState("Subject");
  const [subject, setsubject] = useState([]);
  const [cats, setcats] = useState([]);
  const [dataId, setdataId] = useState("");
  const [subData, setsubData] = useState([]);
  const [time1, settime1] = useState(0);
  const [time2, settime2] = useState(0);
  const [time3, settime3] = useState(0);
  const [time4, settime4] = useState(0);
  const [time5, settime5] = useState(0);
  const [time6, settime6] = useState(0);
  const [time7, settime7] = useState(0);
  const [factor, setfactor] = useState(0);
  const date = [];
  const month = [];
  const year = [];
  Axios.defaults.withCredentials = true;
  const updateBars = () => {
    settime1(0);
    settime2(0);
    settime3(0);
    settime4(0);
    settime5(0);
    settime6(0);
    settime7(0);
    if (subData.length > 0) {
      for (let i = 0; i < 7; i++) {
        if (subData[i]) {
          if (
            subData[i].date === date[i] &&
            subData[i].month === month[i] &&
            subData[i].year === year[i]
          ) {
            if (i === 0) {
              settime1(subData[i].total);
            } else if (i === 1) {
              settime2(subData[i].total);
            } else if (i === 2) {
              settime3(subData[i].total);
            } else if (i === 3) {
              settime4(subData[i].total);
            } else if (i === 4) {
              settime5(subData[i].total);
            } else if (i === 5) {
              settime6(subData[i].total);
            } else if (i === 6) {
              settime7(subData[i].total);
            }
            getMax(time1, time2, time3, time4, time5, time6, time7);
          }
        }
      }
    }
  };

  const getMax = (time1, time2, time3, time4, time5, time6, time7) => {
    const arr = [time1, time2, time3, time4, time5, time6, time7];
    if (Math.max(...arr) !== 0) {
      setfactor(250 / Math.max(...arr));
    } else {
      setfactor(0);
    }
    const sum = arr.reduce((a, b) => a + b, 0);
    const avg = sum / arr.length || 0;
  };
  const dates = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    let month1 = d.getMonth() + 1;
    let date1 = d.getDate();
    if (d.getDate() < 10) {
      date1 = "0" + d.getDate();
    }
    date.push(d.getDate());
    month.push(month1);
    year.push(d.getFullYear());
    return d.getFullYear() + "-" + month1 + "-" + date1;
  });
  // Backend Functions
  const getSubjects = () => {
    Axios.get(`${window.server_link}/getSubjects`).then((response) => {
      setsubject(response.data);
    });
  };

  const getCats = () => {
    Axios.get(`${window.server_link}/getCats`).then((response) => {
      setcats(response.data);
    });
  };
  const getsevenData = () => {
    if (filterType === "true") {
      Axios.post(`${window.server_link}/subseven`, {
        sub_id: dataId,
        day1: dates[0],
        day2: dates[1],
        day3: dates[2],
        day4: dates[3],
        day5: dates[4],
        day6: dates[5],
        day7: dates[6],
      }).then((result) => {
        setsubData(result.data);
      });
    } else if (filterType === "false") {
      Axios.post(`${window.server_link}/catseven`, {
        cat_id: dataId,
        day1: dates[0],
        day2: dates[1],
        day3: dates[2],
        day4: dates[3],
        day5: dates[4],
        day6: dates[5],
        day7: dates[6],
      }).then((result) => {
        setsubData(result.data);
      });
    }
  };

  // Backend Functions end

  const showOptions = [];

  if (filterType === "true") {
    showOptions.length = 0;
    for (let i = 0; i < subject.length; i++) {
      showOptions.push(
        <option value={subject[i].id}>{subject[i].sub_name}</option>
      );
    }
  } else if (filterType === "false") {
    showOptions.length = 0;
    for (let i = 0; i < cats.length; i++) {
      showOptions.push(<option value={cats[i].id}>{cats[i].cat_name}</option>);
    }
  }

  useEffect(() => {
    getSubjects();
    getCats();
  }, []);
  useEffect(() => {
    getsevenData();
  }, [dataId]);
  useEffect(() => {
    updateBars();
  });

  return (
    <div className={styles.outer_box}>
      <div className={styles.bar_box}>
        <div style={{ height: time7 * factor + "px" }}>
          <span>{time7}</span>
        </div>
        <div style={{ height: time6 * factor + "px" }}>
          <span>{time6}</span>
        </div>
        <div style={{ height: time5 * factor + "px" }}>
          <span>{time5}</span>
        </div>
        <div style={{ height: time4 * factor + "px" }}>
          <span>{time4}</span>
        </div>
        <div style={{ height: time3 * factor + "px" }}>
          <span>{time3}</span>
        </div>
        <div style={{ height: time2 * factor + "px" }}>
          <span>{time2}</span>
        </div>
        <div style={{ height: time1 * factor + "px" }}>
          <span>{time1}</span>
        </div>
      </div>
      <div className={styles.date_box}>
        <div>
          <span>{date[6]}</span>
        </div>
        <div>
          <span>{date[5]}</span>
        </div>
        <div>
          <span>{date[4]}</span>
        </div>
        <div>
          <span>{date[3]}</span>
        </div>
        <div>
          <span>{date[2]}</span>
        </div>
        <div>
          <span>{date[1]}</span>
        </div>
        <div>
          <span>{date[0]}</span>
        </div>
      </div>
      <div
        className={styles.top_box}
        onChange={(ev) => {
          if (ev.target.value === "true") {
            setfilterType("true");
            setselectText("Subject");
          } else {
            setfilterType("false");
            setselectText("Category");
          }
          document.getElementById("selectValue").value = "";
        }}
      >
        <input
          type="radio"
          name="type"
          value="true"
          checked={filterType === "true"}
        ></input>
        <span>Subject</span>
        <input
          type="radio"
          name="type"
          value="false"
          checked={filterType === "false"}
        ></input>
        <span>Category</span>
      </div>
      <div className={styles.selectBox}>
        <select
          id="selectValue"
          onChange={(ev) => {
            setdataId(ev.target.value);
          }}
        >
          <option value="" hidden>
            Select {selectText} . . .
          </option>
          {showOptions}
        </select>
      </div>
    </div>
  );
};

export default withRouter(SelfTraker);
