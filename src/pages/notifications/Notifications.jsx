import React from "react";
import styles from "./Notifications.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { useState } from "react";
import CardLong from "../../components/CardLong/CardLong.jsx";
import nouveauMembre from "../../assets/notifs/nv-membre.svg";
import quitterEquipe from "../../assets/notifs/member-quit.svg";
import scrimNotif from "../../assets/notifs/nv-scrim.svg";
const Notifications = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <div className={styles.content}>
          <CardLong
            icon={nouveauMembre}
            title="Nouveau membre de l'équipe"
            subtitle="Musashiii"
            timestamp="Il y a 10 minutes"
          />
          <CardLong
            icon={quitterEquipe}
            title="Un membre a quitté l'équipe"
            subtitle="w0xic"
            timestamp="Il y a 15 minutes"
          />
          <CardLong
            icon={scrimNotif}
            title="Nouveau scrim"
            subtitle="team_XANTARES vs team_w0xic"
            timestamp="Il y a 20 minutes"
          />
          <CardLong
            icon={nouveauMembre}
            title="Nouveau membre de l'équipe"
            subtitle="donk666"
            timestamp="Il y a 25 minutes"
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
