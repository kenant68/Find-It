import React from 'react';
import logo from '../../assets/logo.png'
import styles from './Logo.module.css'

const Logo = () => {
    return (
        <div className={styles.logoContainer}>
            <img src={logo} alt="Find-It Logo" className={styles.logo} />
        </div>
    );
};

export default Logo;