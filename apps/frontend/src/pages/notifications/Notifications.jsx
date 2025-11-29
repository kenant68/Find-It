import React, { useState, useEffect } from "react";
import styles from "./Notifications.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import CardLong from "../../components/CardLong/CardLong.jsx";
import nouveauMembre from "../../assets/notifs/nv-membre.svg";
import quitterEquipe from "../../assets/notifs/member-quit.svg";
import scrimNotif from "../../assets/notifs/nv-scrim.svg";

const iconMap = {
  new_member: nouveauMembre,
  member_quit: quitterEquipe,
  new_scrim: scrimNotif,
};

const Notifications = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch("http://localhost:3000/notifications");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des notifications");
        }
        const data = await response.json();
        setNotifications(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
      }
    };

    loadNotifications();
  }, []);

  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <div className={styles.content}>
          {notifications.length === 0 ? (
            <p className={styles.emptyMessage}>Aucune notification</p>
          ) : (
            notifications.map((notification) => (
              <CardLong
                key={notification.id}
                icon={iconMap[notification.type]}
                title={notification.title}
                subtitle={notification.subtitle}
                timestamp={notification.timestamp}
                onDelete={() => handleDeleteNotification(notification.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
