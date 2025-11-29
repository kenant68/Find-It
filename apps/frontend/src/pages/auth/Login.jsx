import React from "react";
import styles from "./Login.module.css";
import AuthcardLogin from "../../components/AuthCardLogin/AuthcardLogin.jsx";
import Logo from "../../components/icons/Logo.jsx";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className={styles.pageWrapper}>
      <Link to={"/"}>
        <Logo></Logo>
      </Link>
      <div className={styles.cardContainer}>
        <AuthcardLogin title={"Se connecter"} />
      </div>
    </div>
  );
};

export default Login;
