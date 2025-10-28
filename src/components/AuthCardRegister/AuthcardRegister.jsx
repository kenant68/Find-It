import React from 'react';
import Button from "../button/Button.jsx";
import Input from "../Input/Input.jsx";
import styles from "./AuthcardRegister.module.css";
import { Link } from "react-router-dom";

const AuthcardRegister = ({ title }) => {
    return (
        <div>
            <section className={styles.card}>
                <div className={styles.container}>
                    <h1 className={styles.h1}>{title}</h1>
                    <Input name="Email" />
                    <Input name="Mot de passe" />
                    <Input name="Confirmez le mot de passe" />
                    <Button className={styles["container-button"]} text="S'inscrire" />


                    <Link to="/login" className={styles.linkToLogin}>
                        J'ai déjà un compte
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AuthcardRegister;
