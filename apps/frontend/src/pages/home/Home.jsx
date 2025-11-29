import React from "react";
import Button from "../../components/button/Button.jsx";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import Logo from "../../components/icons/Logo.jsx";
import githubIcon from "../../assets/github.svg";

const Home = () => {
  return (
    <div className={styles.pageWrapper}>
      <a
        href="https://github.com/kenant68"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubLink}
      >
        <img src={githubIcon} alt="GitHub" className={styles.githubIcon} />
      </a>
      <div className={styles.container}>
        <Logo></Logo>
        <div className={styles.title}>
          <h1>FindIT</h1>
          <p>L'application pour programmer vos scrims</p>
        </div>
        <div className={styles.divButtons}>
          <Link to="/register" className={styles.linkToLogin}>
            <Button text={"S'inscrire"}></Button>
          </Link>
          <Link to="/login" className={styles.linkToRegister}>
            <Button text={"Se connecter"}></Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
