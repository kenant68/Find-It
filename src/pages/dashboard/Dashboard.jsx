import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import styles from "./Dashboard.module.css";
import Card from "../../components/Card/Card.jsx";
import CardScrims from "../../components/CardScrims/CardScrims.jsx";
import CardTeamMates from "../../components/CardTeamMates/CardTeamMates.jsx";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>

        <div
          className={`${styles.content} ${
            isCollapsed ? styles.contentCollapsed : ""
          }`}
        >
          <div className={styles.cardsContainer}>
            <Card>
              <CardScrims />
            </Card>

            <Card>
              <CardTeamMates />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
