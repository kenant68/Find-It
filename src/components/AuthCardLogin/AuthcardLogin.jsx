import React from 'react';
import Button from "../button/Button.jsx";
import styles from "./AuthcardLogin.module.css";
import Input from "../Input/Input.jsx";
import {useNavigate} from "react-router-dom";


const AuthcardLogin = ({title}) => {

const navigate = useNavigate();

    return (
        <div>
            <section className={styles.card}>
                <div className={styles.container}>
                    <h1 className={styles.h1}>{title}</h1>
                    <Input name={"Email"}></Input>
                    <Input name={"Mot de passe"}></Input>
                    <Button text={"Se connecter"}></Button>
                    <div className={styles.linksRow}>
                        <a className={styles.linkToRegister} onClick={()=> navigate('/register')}>Créer un compte</a>
                        <a className={styles.passwdForgotten} onClick={()=> navigate('/')}>Mot de passe oublié</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AuthcardLogin;