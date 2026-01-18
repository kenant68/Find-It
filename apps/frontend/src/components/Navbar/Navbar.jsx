import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useState } from "react";
import UserProfile from "../UserProfile/UserProfile.jsx";

import sidebarOpenIcon from "../../assets/sidebar-open.png";
import sidebarClosedIcon from "../../assets/sidebar-closed.png";
import castleIcon from "../../assets/navbar/castle.svg";
import teamsIcon from "../../assets/teams.png";
import matchsIcon from "../../assets/matchs.png";
import announceIcon from "../../assets/announce.png";
import notificationIcon from "../../assets/notifications.png";
import logo from "../../assets/logo.png";

export default function Navbar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const collapsed = isCollapsed !== undefined ? isCollapsed : localCollapsed;
  const setCollapsed =
    setIsCollapsed !== undefined ? setIsCollapsed : setLocalCollapsed;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.topSection}>
        <div className={styles.logoTitle}>
          <img
            src={logo}
            alt="FindIT Logo"
            className={styles.toggleIcon}
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          />
          {!collapsed && <span className={styles.title}>FindIT</span>}
        </div>

        <button
          className={styles.toggleBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          <img
            src={collapsed ? sidebarOpenIcon : sidebarClosedIcon}
            alt={collapsed ? "Ouvrir la sidebar" : "Fermer la sidebar"}
            className={styles.toggleIcon}
          />
        </button>
      </div>

      <nav>
        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/my-team"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <img src={castleIcon} className={styles.iconSvg} alt="my-team" />
              {!collapsed && <span>Mon Equipe</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/teams"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <img src={teamsIcon} className={styles.icon} alt="teams" />
              {!collapsed && <span>Equipes</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/matchs"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <img src={matchsIcon} className={styles.icon} alt="matchs" />
              {!collapsed && <span>Matches</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/announces"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <img src={announceIcon} className={styles.icon} alt="announces" />
              {!collapsed && <span>Annonces</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <img
                src={notificationIcon}
                className={styles.icon}
                alt="notifications"
              />
              {!collapsed && <span>Notifications</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      <UserProfile isCollapsed={collapsed} />
    </aside>
  );
}
