import React from 'react';
import styles from "./Card.module.css";

const Card = ({children}) => {
    return (
        <div className={styles.card}>
                <div className={styles.container}>
                    {children}
                </div>
        </div>
    );
};

export default Card;