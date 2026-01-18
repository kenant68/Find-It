import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../utils/auth.jsx";
import { getUserById } from "../../utils/api.js";
import styles from "./NavbarMobile.module.css";

import homeIcon from "../../assets/navbar/Home.svg";
import castleIcon from "../../assets/navbar/castle.svg";
import teamsIcon from "../../assets/teams.png";
import matchsIcon from "../../assets/matchs.png";
import announceIcon from "../../assets/announce.png";

export default function NavbarMobile() {
  const { user, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const loadUserDetails = async () => {
      if (user?.id) {
        try {
          const details = await getUserById(user.id);
          setUserDetails(details);
        } catch (error) {
          console.error("Erreur lors du chargement des détails utilisateur:", error);
        }
      }
    };

    loadUserDetails();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
  };

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
            <img
              src={userDetails?.avatarUrl || "https://via.placeholder.com/24x24?text=U"}
              className={styles.avatarIcon}
              alt="profil"
            />
            <span>{userDetails?.username || "Profil"}</span>
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
          <button
            onClick={handleLogout}
            className={`${styles.link} ${styles.logoutBtn}`}
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
