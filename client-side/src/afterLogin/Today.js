import React, { useState, useEffect } from "react";
import styles from "./scss/today.module.scss";
import Axios from "axios";

const Today = () => {
  const [Subject, setSubject] = useState([]);
  const [subId, setsubId] = useState("");
  const [duration, setduration] = useState("");
  const [placeholder, setplaceholder] = useState("Duration in Minutes");
  const [durationType, setdurationType] = useState("true"); // true means minutes
  const [leftduration, setleftduration] = useState([]);
  const [valid, setvalid] = useState(false);
  const [showError, setshowError] = useState("");
  const [todayDataList, settodayDataList] = useState([]);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  Axios.defaults.withCredentials = true;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth();
  let year = newDate.getFullYear();
  let day = newDate.getDay();
  let a = month + 1;
  let com_date = year + "-" + a + "-" + date;
  // Backend Function Start
  const getSubjects = () => {
    Axios.get(`${window.server_link}/getactiveSubjects`).then((response) => {
      setSubject(response.data);
    });
  };
  const addData = () => {
    Axios.post(`${window.server_link}/addData`, {
      subId: subId,
      duration: duration,
      date: date,
      month: month + 1,
      year: year,
      com_date: com_date,
    }).then(() => {
      document.getElementById("subject").value = "";
      document.getElementById("duration").value = "";
      setsubId("");
      setduration("");
      checkTimeLeft();
      getTodayData();
    });
  };
  const checkTimeLeft = () => {
    Axios.post(`${window.server_link}/timeLeft`, {
      date: date,
      month: month + 1,
      year: year,
    }).then((result) => {
      setleftduration(1440 - result.data[0].total_duration);
    });
  };
  const getTodayData = () => {
    Axios.post(`${window.server_link}/todayData`, {
      date: date,
      month: month + 1,
      year: year,
    }).then((result) => {
      settodayDataList(result.data);
    });
  };
  const removeData = (list_id) => {
    Axios.post(`${window.server_link}/removeData`, {
      list_id: list_id,
    }).then(() => {
      getTodayData();
      checkTimeLeft();
    });
  };
  // Backend functions end

  const showSubjects = [];
  for (let i = 0; i < Subject.length; i++) {
    showSubjects.push(
      <option value={Subject[i].id}>{Subject[i].sub_name}</option>
    );
  }
  const checkValidDuration = (time) => {
    if (durationType === "true") {
      if (time < 5 || time > leftduration) {
        setshowError("Duration is between 5 min and " + leftduration + " min");
      } else if (time % 5 !== 0) {
        setshowError("Duration must be multiple of 5");
      } else {
        setshowError("");
      }
    } else {
      if (time * 60 > leftduration || time < 0.25) {
        setshowError(
          "Duration is between 0.25 hr and " +
            (leftduration - (leftduration % 15)) / 15 / 4 +
            " hr"
        );
      } else if (time % 0.25 !== 0) {
        setshowError("Duration must be multiple of 0.25");
      } else {
        setshowError("");
      }
    }
  };
  const checkValidForm = () => {
    if (durationType === "true") {
      if (duration < 5 || duration > leftduration) {
        setvalid(false);
      } else if (duration % 5 !== 0) {
        setvalid(false);
      } else if (subId !== "") {
        setvalid(true);
      }
    } else {
      if (duration > leftduration || duration / 60 < 0.25) {
        setvalid(false);
      } else if ((duration / 60) % 0.25 !== 0) {
        setvalid(false);
      } else if (subId !== "") {
        setvalid(true);
      }
    }
  };
  const todayList = [];
  for (let i = 0; i < todayDataList.length; i++) {
    todayList.push(
      <div className={styles.eachData}>
        <div>{todayDataList.length - i}</div>
        <p>{todayDataList[i].sub_name}</p>
        <span>{todayDataList[i].duration}</span>
        <div
          onClick={() => {
            removeData(todayDataList[i].id);
          }}
        >
          +
        </div>
      </div>
    );
  }

  useEffect(() => {
    getSubjects();
    getTodayData();
  }, []);
  useEffect(() => {
    checkTimeLeft();
  }, [duration, subId]);
  useEffect(() => {
    checkValidForm();
  });

  return (
    <>
      <div className={styles.date}>
        <div>{weekDays[day]}</div>
        <div>
          {date} {months[month]} {year}
        </div>
      </div>
      <div className={styles.formFill}>
        <h1>Fill Activity Form</h1>
        <p>
          <i className="far fa-caret-square-down"></i> Select Subject *
        </p>
        <select
          id="subject"
          onChange={(ev) => {
            setsubId(ev.target.value);
          }}
        >
          <option value="" hidden>
            Select Subject . . .
          </option>
          {showSubjects}
        </select>
        <p>
          <i className="far fa-clock"></i> Duration *
        </p>
        <input
          type="number"
          id="duration"
          className={styles.duration}
          placeholder={placeholder}
          onChange={(ev) => {
            checkValidDuration(ev.target.value);
            if (durationType === "true") {
              setduration(ev.target.value);
            } else {
              setduration(ev.target.value * 60);
            }
          }}
        ></input>
        <h6>{showError}</h6>
        <div
          className={styles.mins}
          onChange={(ev) => {
            setdurationType(ev.target.value);
            setshowError("");
            if (ev.target.value === "true") {
              setplaceholder("Duration in Minutes");
              setduration(null);
              document.getElementById("duration").value = "";
            } else {
              setplaceholder("Duration in Hours");
              setduration(null);
              document.getElementById("duration").value = "";
            }
          }}
        >
          <input
            type="radio"
            name="duration"
            checked={durationType === "true"}
            value="true"
          ></input>
          <span>Minutes</span>
          <input
            type="radio"
            name="duration"
            value="false"
            checked={durationType === "false"}
          ></input>
          <span>Hour</span>
          <span>
            {durationType === "true"
              ? leftduration + " min"
              : (leftduration - (leftduration % 15)) / 15 / 4 + " hr"}{" "}
            left
          </span>
        </div>

        <button onClick={addData} disabled={!valid}>
          Submit
        </button>
      </div>
      <div className={styles.allData}>
        <h1>Today Filled Data ({todayDataList.length})</h1>
        {todayList}
      </div>
    </>
  );
};

export default Today;
