import React from "react";
import styles from "./ProfileGameStats.module.css";
import cs2Image from "../../assets/profil/cs2.jpg";

const ProfileGameStats = ({ stats }) => {
  if (!stats) return null;

  const winRate = stats.win_rate ? stats.win_rate.replace("%", "") : "0";

  const recentResults = Array.isArray(stats.recent_matches)
    ? stats.recent_matches
    : (typeof stats.recent_matches === 'string' ? stats.recent_matches.split(" ") : []);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={cs2Image} alt="CS2" className={styles.gameImage} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.gameTitle}>CS2</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>ELO</span>
            <span className={styles.statValue}>{stats.elo || 'N/A'}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Matches</span>
            <span className={styles.statValue}>{stats.matches_played || 0}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Victoires</span>
            <span className={styles.statValue}>{stats.wins || 0}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Pourcentage de Victoires</span>
            <span className={styles.statValue}>{winRate}%</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Série actuelle</span>
            <span className={styles.statValue}>{stats.winstreak || 0}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>K/D Ratio</span>
            <span className={styles.statValue}>{stats.average_K_D || 'N/A'}</span>
          </div>
        </div>
        <div className={styles.recentResults}>
          <span className={styles.resultsLabel}>Résultats récents</span>
          <div className={styles.resultsContainer}>
            {recentResults.length > 0 ? recentResults.slice(0, 10).map((result, index) => (
              <span
                key={index}
                className={`${styles.resultBadge} ${
                  result === "W" || result === "win" ? styles.win : styles.loss
                }`}
              >
                {result === "W" || result === "win" ? "W" : "L"}
              </span>
            )) : (
              <span className={styles.noResults}>Aucun match récent</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGameStats;
