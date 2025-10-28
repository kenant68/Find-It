import React from "react";
import styles from "./Input.module.css";

const Input = ({ name }) => {
    return (
        <div className={styles.inputGroup}>
            <label className={styles.label}>{name}</label>
            <input type="text" className={styles.input} />
        </div>
    );
};

export default Input;
