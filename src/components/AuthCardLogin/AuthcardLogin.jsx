import React from 'react';
import Button from "../button/Button.jsx";
import styles from "./AuthcardLogin.module.css";
import Input from "../Input/Input.jsx";

const AuthcardLogin = ({title}) => {


    return (
        <div>
            <section className={styles.card}>
                <div className={styles.container}>
                    <h1 className={styles.h1}>{title}</h1>
                    <Input name={"Email"}></Input>
                    <Input name={"Mot de passe"}></Input>
                    <Button text={"Se connecter"}></Button>
                </div>
            </section>
        </div>
    );
};

export default AuthcardLogin;