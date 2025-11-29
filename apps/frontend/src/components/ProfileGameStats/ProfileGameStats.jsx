import React from "react";
import styles from "./ProfileGameStats.module.css";
import cs2Image from "../../assets/profil/cs2.jpg";

const ProfileGameStats = ({ stats }) => {
  if (!stats) return null;

  const winRate = stats.win_rate ? stats.win_rate.replace("%", "") : "0";

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={cs2Image} alt="CS2" className={styles.gameImage} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.gameTitle}>CS2</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Matches</span>
            <span className={styles.statValue}>{stats.matches_played}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Pourcentage de Victoires</span>
            <span className={styles.statValue}>{winRate}%</span>
          </div>
        </div>
        <div className={styles.recentResults}>
          <span className={styles.resultsLabel}>Recents Résultats</span>
          <div className={styles.resultsContainer}>
            {stats.recent_matches.split(" ").map((result, index) => (
              <span
                key={index}
                className={`${styles.resultBadge} ${
                  result === "W" ? styles.win : styles.loss
                }`}
              >
                {result}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGameStats;
