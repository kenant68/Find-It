import React from 'react';
import Button from "../button/Button.jsx";
import Input from "../Input/Input.jsx";
import styles from "./AuthcardRegister.module.css";

const AuthcardRegister = ({title}) => {




    return (
        <div>
            <section className={styles.card}>
                <div className={styles.container}>
                    <h1 className={styles.h1}>{title}</h1>
                    <Input name={"Email"}></Input>
                    <Input name={"Mot de passe"}></Input>
                    <Input name={"Confirmez le mot de passe"}/>
                    <Button text={"S'inscrire"}></Button>
                </div>
            </section>
        </div>
    );
};

export default AuthcardRegister;