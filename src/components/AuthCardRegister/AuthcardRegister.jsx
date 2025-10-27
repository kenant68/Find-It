import React from 'react';
import Button from "../button/Button.jsx";
import styles from "./AuthCard.module.css";
import Input from "../Input/Input.jsx";

const Authcard = ({title}) => {


    const btnName = () => {
        if (title === "Inscription") return "S'inscrire";
        if (title === "Se connecter") return "Se connecter";
    };

    const isRegister = title === "Inscription";


    return (
        <div>
            <section className={styles.card}>
                <div className={styles.container}>
                    <h1 className={styles.h1}>{title}</h1>
                    <Input name={"Email"}></Input>
                    <Input name={"Mot de passe"}></Input>
                    {isRegister && <Input name={"Confirmez le mot de passe"}/>}
                    <Button text={btnName()}></Button>
                </div>
            </section>
        </div>
    );
};

export default Authcard;