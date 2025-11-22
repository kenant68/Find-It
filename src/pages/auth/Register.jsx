import React from "react";
import AuthcardRegister from "../../components/AuthCardRegister/AuthcardRegister.jsx";
import styles from "./Register.module.css";
import Logo from "../../components/icons/Logo.jsx";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className={styles.pageWrapper}>
      <Link to={"/"}>
        <Logo></Logo>
      </Link>
      <div className={styles.cardContainer}>
        <AuthcardRegister title={"Inscription"} />
      </div>
    </div>
  );
};

export default Register;
