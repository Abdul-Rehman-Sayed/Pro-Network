import React from "react";
import styles from "./index.module.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.homeContainer}>
        <div className={styles.homeContainer_leftBar}></div>
        <div className={styles.feedContainer}>{children}</div>
        <div className={styles.extraContainer}></div>
      </div>
    </div>
  );
};

export default DashboardLayout;
