import React from "react";
import styles from "./Notifications.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { useState } from "react";

const Notifications = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
