import Navbar from "../../components/Navbar/Navbar.jsx";
import styles from "./Dashboard.module.css";
import Card from "../../components/Card/Card.jsx";
import CardScrims from "../../components/CardScrims/CardScrims.jsx";

const Dashboard = () => {
    return (
        <div className={styles.layout}>
            <div className={styles.sidebar}>
                <Navbar />
            </div>

            <div className={styles.content}>
                <Card>
                    <CardScrims />
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
