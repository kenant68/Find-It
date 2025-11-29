import React from "react";
import styles from "./Bubble.module.css";

const Bubble = ({ children, variant = "default" }) => {
  return (
    <div
      className={`${styles.bubble} ${
        variant === "pink" ? styles.bubblePink : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Bubble;
