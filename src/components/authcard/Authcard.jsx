import React from 'react';
import Button from "../button/Button.jsx";
import styles from "./AuthCard.module.css";

const Authcard = ({title}) => {
    return (
        <div>
            <section className={styles.card}>
                <div className={styles.container}>
                    <h1 className={styles.h1}>{title}</h1>
                    <Button text={"Se connecter"}></Button>
                </div>
            </section>
        </div>
    );
};

export default Authcard;