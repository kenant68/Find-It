import React from 'react';
import Button from "../button/Button.jsx";
import Input from "../Input/Input.jsx";
import styles from "./AuthcardRegister.module.css";
import {useNavigate} from "react-router-dom";

const AuthcardRegister = ({title}) => {

const navigate = useNavigate();

    return (
        <div>
            <section className={styles.card}>
                <div className={styles.container}>
                    <h1 className={styles.h1}>{title}</h1>
                    <Input name={"Email"}></Input>
                    <Input name={"Mot de passe"}></Input>
                    <Input name={"Confirmez le mot de passe"}/>
                    <Button className={styles["container-button"]} text={"S'inscrire"}></Button>
                    <a className={styles.linkToLogin} onClick={()=> navigate('/login')}>J'ai déjà un compte</a>
                </div>
            </section>
        </div>
    );
};

export default AuthcardRegister;