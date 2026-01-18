import React from "react";
import styles from "./ProfileBanner.module.css";
import banniereImg from "../../assets/profil/banniere.png";
import editIcon from "../../assets/profil/edit.svg";

const ProfileBanner = ({ user, onEditBanner, onEditUsername, onEditAvatar, bannerUrl }) => {
  if (!user) return null;

  return (
    <div className={styles.bannerContainer}>
      <img
        src={bannerUrl || banniereImg}
        alt="Bannière"
        className={styles.bannerImage}
      />
      <button
        className={styles.bannerEditButton}
        onClick={onEditBanner}
        type="button"
        aria-label="Modifier la bannière"
      >
        <img src={editIcon} alt="Modifier la bannière" />
      </button>
      <div className={styles.bannerOverlay}>
        <div className={styles.bannerContent}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <img
                src={user.avatarUrl || "https://via.placeholder.com/100x100?text=U"}
                alt={user.username}
                className={styles.avatar}
              />
              <button
                className={styles.editAvatarButton}
                onClick={onEditAvatar}
                type="button"
                aria-label="Modifier l'avatar"
              >
                <img src={editIcon} alt="Modifier l'avatar" />
              </button>
            </div>
            <div className={styles.usernameSection}>
              <h1 className={styles.username}>{user.username}</h1>
              <button
                className={styles.editUsernameButton}
                onClick={onEditUsername}
                type="button"
                aria-label="Modifier le pseudo"
              >
                <img src={editIcon} alt="Modifier le pseudo" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;

