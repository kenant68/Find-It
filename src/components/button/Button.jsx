import React from 'react';
import styles from './Button.module.css'

const Button = ({text,className}) => {
    return (
        <button className={`${styles.button} ${className || ''}`}>{text}</button>
    );
};

export default Button;