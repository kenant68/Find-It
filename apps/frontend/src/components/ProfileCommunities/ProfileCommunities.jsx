import React from "react";
import styles from "./ProfileCommunities.module.css";
import steamIcon from "../../assets/profil/steam.svg";
import discordIcon from "../../assets/profil/discord.svg";
import editIcon from "../../assets/profil/edit.svg";

const ProfileCommunities = ({ user, onEditSteam, onEditDiscord, onEditRegion }) => {
  if (!user) return null;

  return (
    <div className={styles.card}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Communautés</h3>
          <button
            className={styles.editSectionButton}
            onClick={onEditSteam}
            type="button"
            aria-label="Modifier Steam"
          >
            <img src={editIcon} alt="Modifier Steam" />
          </button>
        </div>
        <div className={styles.communities}>
          {user.steamUrl && (
            <a
              href={user.steamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.communityLink}
            >
              <img src={steamIcon} alt="Steam" className={styles.communityIcon} />
            </a>
          )}
          {!user.steamUrl && (
            <div className={styles.communityLink} title="Steam non configuré">
              <img src={steamIcon} alt="Steam" className={styles.communityIcon} />
            </div>
          )}
        </div>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Discord</span>
          <button
            className={styles.editSectionButton}
            onClick={onEditDiscord}
            type="button"
            aria-label="Modifier Discord"
          >
            <img src={editIcon} alt="Modifier Discord" />
          </button>
        </div>
        <div className={styles.communities}>
          {user.discordUsername && (
            <div className={styles.communityLink} title={user.discordUsername}>
              <img
                src={discordIcon}
                alt="Discord"
                className={styles.communityIcon}
              />
            </div>
          )}
          {!user.discordUsername && (
            <div className={styles.communityLink} title="Discord non configuré">
              <img
                src={discordIcon}
                alt="Discord"
                className={styles.communityIcon}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Région</h3>
          <button
            className={styles.editSectionButton}
            onClick={onEditRegion}
            type="button"
            aria-label="Modifier la région"
          >
            <img src={editIcon} alt="Modifier la région" />
          </button>
        </div>
        <p className={styles.regionText}>{user.region || "Non spécifiée"}</p>
      </div>
    </div>
  );
};

export default ProfileCommunities;

