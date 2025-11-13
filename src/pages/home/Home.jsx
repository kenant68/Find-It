import React from 'react';
import Button from "../../components/button/Button.jsx";
import styles from "./Home.module.css";
import {Link} from "react-router-dom";


const Home = () => {
    return (
        <div>
            <div className={styles.title}>
                <h1>FindIT</h1>
                <p>L'application pour programmer vos scrims</p>
            </div>
            <div className={styles.divButtons}>
                <Link to="/register" className={styles.linkToLogin}>
                    <Button text={"S'inscrire"}></Button>
                </Link>
                <Link to="/login" className={styles.linkToRegister}><Button text={"Se connecter"}></Button></Link>
            </div>
        </div>
    );
};

export default Home;