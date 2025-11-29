import React from "react";
import styles from "./ProfileBanner.module.css";
import banniereImg from "../../assets/profil/banniere.png";
import editIcon from "../../assets/profil/edit.svg";

const ProfileBanner = ({ user, onEdit, onEditBanner }) => {
  if (!user) return null;

  return (
    <div className={styles.bannerContainer}>
      <img src={banniereImg} alt="Bannière" className={styles.bannerImage} />
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
                src={user.avatar_url}
                alt={user.username}
                className={styles.avatar}
              />
              <button
                className={styles.editButton}
                onClick={onEdit}
                type="button"
                aria-label="Modifier le profil"
              >
                <img src={editIcon} alt="Modifier" />
              </button>
            </div>
            <h1 className={styles.username}>{user.username}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;

