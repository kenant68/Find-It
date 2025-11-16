import React from 'react';
import Navbar from "../../components/Navbar/Navbar.jsx";
import styles from "./Dashboard.module.css";
import Card from "../../components/Card/Card.jsx";
const Dashboard = () => {
    return (
        <div>
                <div className={styles.navbar}>
                    <Navbar/>
                </div>
                <Card></Card>

        </div>
    );
};

export default Dashboard;