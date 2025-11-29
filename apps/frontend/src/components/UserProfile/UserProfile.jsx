import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./UserProfile.module.css";

const UserProfile = ({ isCollapsed }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.userSection}>
      <Link to="/profil" className={styles.userInfo}>
        <div className={styles.avatarContainer}>
          <img
            src={user.avatar_url}
            alt={user.username}
            className={styles.avatar}
          />
        </div>
        {!isCollapsed && (
          <span className={styles.username}>{user.username}</span>
        )}
      </Link>
      {!isCollapsed && (
        <button className={styles.logoutButton} onClick={handleLogout}>
          <span>Déconnexion</span>
        </button>
      )}
    </div>
  );
};

export default UserProfile;
