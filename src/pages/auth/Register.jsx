import React from 'react';
import AuthcardRegister from "../../components/AuthCardRegister/AuthcardRegister.jsx";
import styles from './Register.module.css'
import Logo from "../../components/icons/Logo.jsx";
import {Link} from "react-router-dom";

const Register = () => {
    return (
        <div>
            <Link to={"/"}><Logo></Logo></Link>
            <AuthcardRegister title={"Inscription"}/>
        </div>
    );
};

export default Register;