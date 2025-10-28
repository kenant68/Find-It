import React from 'react';
import Button from "../button/Button.jsx";
import styles from "./AuthcardLogin.module.css";
import Input from "../Input/Input.jsx";
import {Link} from "react-router-dom";


const AuthcardLogin = ({title}) => {



    return (
        <div>
            <section className={styles.card}>
                <div className={styles.container}>
                    <h1 className={styles.h1}>{title}</h1>
                    <Input name={"Email"}></Input>
                    <Input name={"Mot de passe"}></Input>
                    <Button text={"Se connecter"}></Button>
                    <div className={styles.linksRow}>
                        <Link to="/register" className={styles.linkToRegister}>Créer un compte</Link>
                        <Link to="/" className={styles.passwdForgotten}>Mot de passe oublié</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AuthcardLogin;