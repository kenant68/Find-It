import React from "react";
import styles from "./ProfileCommunities.module.css";
import steamIcon from "../../assets/profil/steam.svg";
import discordIcon from "../../assets/profil/discord.svg";

const ProfileCommunities = ({ user }) => {
  if (!user) return null;

  return (
    <div className={styles.card}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Communautés</h3>
        <div className={styles.communities}>
          {user.steam_url && (
            <a
              href={user.steam_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.communityLink}
            >
              <img src={steamIcon} alt="Steam" className={styles.communityIcon} />
            </a>
          )}
          {user.discord_username && (
            <div className={styles.communityLink} title={user.discord_username}>
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
        <h3 className={styles.sectionTitle}>Région</h3>
        <p className={styles.regionText}>{user.region || "Non spécifiée"}</p>
      </div>
    </div>
  );
};

export default ProfileCommunities;

