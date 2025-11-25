import React from "react";
import styles from "./Bubble.module.css";

const Bubble = ({ children }) => {
  return <div className={styles.bubble}>{children}</div>;
};

export default Bubble;
