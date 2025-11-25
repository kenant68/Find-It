import React from "react";
import styles from "./CardLong.module.css";
import Bubble from "../Bubble/Bubble.jsx";

const CardLong = ({ icon, title, subtitle, timestamp }) => {
  return (
    <div className={styles.card}>
      <Bubble>
        <img src={icon} alt={title} />
      </Bubble>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <p className={styles.timestamp}>{timestamp}</p>
    </div>
  );
};

export default CardLong;
