import React from 'react';
import styles from './Login.module.css'
import AuthcardLogin from "../../components/AuthCardLogin/AuthcardLogin.jsx";

const Login = () => {
    return (
        <div>
            <AuthcardLogin title={"Se connecter"}/>
        </div>
    );
};

export default Login;