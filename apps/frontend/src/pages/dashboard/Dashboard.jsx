import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NavbarMobile from "../../components/NavbarMobile/NavbarMobile.jsx";
import styles from "./Dashboard.module.css";
import Card from "../../components/Card/Card.jsx";
import CardScrims from "../../components/CardScrims/CardScrims.jsx";
import CardTeamMates from "../../components/CardTeamMates/CardTeamMates.jsx";
import CardStats from "../../components/CardStats/CardStats.jsx";
import CardFavStat from "../../components/CardFavStat/CardFavStat.jsx";

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
            <div className={styles.leftColumn}>
              <Card>
                <CardScrims />
              </Card>

              <Card>
                <CardStats />
              </Card>
            </div>

            <div className={styles.rightColumn}>
              <Card>
                <CardTeamMates />
              </Card>

              <Card>
                <CardFavStat />
              </Card>
            </div>
          </div>
        </div>
      </div>
      <NavbarMobile />
    </div>
  );
};

export default Dashboard;
