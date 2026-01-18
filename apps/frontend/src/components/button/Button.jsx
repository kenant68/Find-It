import React from 'react';
import styles from './Button.module.css'

const Button = ({text, children, className, ...props}) => {
    return (
        <button className={`${styles.button} ${className || ''}`} {...props}>
            {text || children}
        </button>
    );
};

export default Button;