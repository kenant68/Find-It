import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavbarMobile.module.css";

import homeIcon from "../../assets/navbar/Home.svg";
import castleIcon from "../../assets/navbar/castle.svg";
import teamsIcon from "../../assets/teams.png";
import matchsIcon from "../../assets/matchs.png";
import announceIcon from "../../assets/announce.png";
import notificationIcon from "../../assets/notifications.png";
import logo from "../../assets/logo.png";

export default function NavbarMobile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/1");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement de l'utilisateur");
        }
        const currentUser = await response.json();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
      }
    };

    loadUser();
  }, []);

  return (
    <nav className={styles.navbarMobile}>
      <ul className={styles.navList}>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <img src={homeIcon} className={styles.iconSvg} alt="dashboard" />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/teams"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <img src={castleIcon} className={styles.iconSvg} alt="teams" />
            <span>Mon Equipe</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/other-teams"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <img src={teamsIcon} className={styles.icon} alt="other-teams" />
            <span>Equipes</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profil"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            {user && user.avatar_url ? (
              <img
                src={user.avatar_url}
                className={styles.avatarIcon}
                alt="profil"
              />
            ) : (
              <img src={logo} className={styles.icon} alt="profil" />
            )}
            <span>Profil</span>
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
            <span>Annonces</span>
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
            <span>Notifications</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
