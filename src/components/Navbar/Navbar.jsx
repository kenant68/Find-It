import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useState } from "react";

import sidebarOpenIcon from "../../assets/sidebar-open.png";
import sidebarClosedIcon from "../../assets/sidebar-closed.png";
import teamsIcon from "../../assets/teams.png";
import matchsIcon from "../../assets/matchs.png";
import announceIcon from "../../assets/announce.png";
import notificationIcon from "../../assets/notifications.png";

export default function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
            <div className={styles.topSection}>
                <button
                    className={styles.toggleBtn}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <img
                        src={isCollapsed ? sidebarOpenIcon : sidebarClosedIcon}
                        alt=""
                        aria-hidden="true"
                        className={styles.toggleIcon}
                    />
                </button>
            </div>

            <nav>
                <ul className={styles.navList}>
                    <li>
                        <NavLink
                            to="/teams"
                            className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }
                        >
                            <img src={teamsIcon} className={styles.icon} alt="teams" />
                            {!isCollapsed && <span>Equipes</span>}
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
                            {!isCollapsed && <span>Matches</span>}
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
                            {!isCollapsed && <span>Annonces</span>}
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
                            {!isCollapsed && <span>Notifications</span>}
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
