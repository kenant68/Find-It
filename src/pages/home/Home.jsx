import React from 'react';
import Button from "../../../../src/components/button/Button.jsx";
import styles from "./Home.module.css";


const Home = () => {
    return (
        <div>
            <div className={styles.title}>
                <h1>FindIT</h1>
                <p>L'application pour programmer vos scrims</p>
            </div>
            <div className={styles.divButtons}>
                <Button text={"S'inscrire"}></Button>
                <Button text={"Se connecter"}></Button>
            </div>
        </div>
    );
};

export default Home;