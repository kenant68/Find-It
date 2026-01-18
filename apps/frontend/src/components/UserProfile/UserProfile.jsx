import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../utils/auth.jsx";
import { getUserById, getImageUrl } from "../../utils/api.js";
import styles from "./UserProfile.module.css";

const UserProfile = ({ isCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
            src={getImageUrl(userDetails?.avatarUrl) || "https://via.placeholder.com/40x40?text=U"}
            alt="User Avatar"
            className={styles.avatar}
          />
        </div>
        {!isCollapsed && (
          <span className={styles.username}>
            {userDetails?.username || "Chargement..."}
          </span>
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
