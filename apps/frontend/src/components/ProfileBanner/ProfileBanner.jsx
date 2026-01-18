import React from "react";
import styles from "./ProfileBanner.module.css";
import banniereImg from "../../assets/profil/banniere.png";
import editIcon from "../../assets/profil/edit.svg";
import ImageUpload from "../ImageUpload/ImageUpload.jsx";
import { getImageUrl } from "../../utils/api.js";

const ProfileBanner = ({ user, onEditUsername, onAvatarUpdate, onBannerUpdate, bannerUrl }) => {
  if (!user) return null;

  const avatarSrc = getImageUrl(user.avatarUrl) || "https://via.placeholder.com/100x100?text=U";
  const bannerSrc = getImageUrl(bannerUrl) || banniereImg;

  return (
    <div className={styles.bannerContainer}>
      <ImageUpload
        type="banner"
        currentImageUrl={bannerSrc}
        onImageUpdate={onBannerUpdate}
        maxSize={10}
        aspectRatio="3/1"
        className={styles.bannerUpload}
      />
      <div className={styles.bannerOverlay}>
        <div className={styles.bannerContent}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <ImageUpload
                type="avatar"
                currentImageUrl={avatarSrc}
                onImageUpdate={onAvatarUpdate}
                maxSize={5}
                circular={true}
                className={styles.avatarUpload}
              />
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

