import React from "react";
import styles from "./Input.module.css";

const Input = ({ name, id, type = "text", value, onChange, placeholder, required }) => {
    const inputId = id || `input-${name.toLowerCase().replace(/\s+/g, '-')}`;
        return (
            <div className={styles.inputGroup}>
                <label htmlFor={inputId} className={styles.label}>{name}</label>
                <input
                    type={type}
                    id={inputId}
                    name={name}
                    className={styles.input}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />
            </div>
        );
};

export default Input;
