import React, { useState, useEffect } from "react";
import styles from "./scss/activity.module.scss";
import ChangeActive from "./ChangeActive";

const Activity = () => {
  const [toggle, settoggle] = useState(true);

  return (
    <div className={styles.activity}>
      <div className={styles.activeToggle}>
        <button
          className={toggle === true ? `${styles.activeBtn}` : null}
          onClick={() => {
            settoggle(true);
          }}
        >
          Subjects
        </button>
        <button
          className={toggle === false ? `${styles.activeBtn}` : null}
          onClick={() => {
            settoggle(false);
          }}
        >
          Category
        </button>
      </div>
      <ChangeActive change={toggle} />
    </div>
  );
};

export default Activity;
