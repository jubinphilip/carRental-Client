import React from "react";
import styles from "./preloader.module.css"; 

const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.div}>
        <p className={styles.h2}>
          Loading....<span />
        </p>
      </div>
    </div>
  );
};

export default Loader;
