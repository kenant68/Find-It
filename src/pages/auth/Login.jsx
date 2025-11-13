import React from 'react';
import styles from './Login.module.css'
import AuthcardLogin from "../../components/AuthCardLogin/AuthcardLogin.jsx";
import Logo from "../../components/icons/Logo.jsx";
import {Link} from "react-router-dom";

const Login = () => {
    return (
        <div>
            <Link to={"/"}><Logo></Logo></Link>
            <AuthcardLogin title={"Se connecter"}/>
        </div>
    );
};

export default Login;