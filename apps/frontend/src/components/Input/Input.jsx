import React from "react";
import styles from "./Input.module.css";

const Input = ({ name,id }) => {
    const inputId = id || `input-${name.toLowerCase().replace(/\s+/g, '-')}`;
        return (
            <div className={styles.inputGroup}>
                <label htmlFor={inputId} className={styles.label}>{name}</label>
                <input type="text" id={inputId} className={styles.input} />
            </div>
        );
};

export default Input;
