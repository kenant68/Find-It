import React from 'react';
import Navbar from "../../components/Navbar/Navbar.jsx";
import styles from "./Dashboard.module.css";
const Dashboard = () => {
    return (
        <div>
                <div className={styles.navbar}>
                    <Navbar/>
                </div>

        </div>
    );
};

export default Dashboard;