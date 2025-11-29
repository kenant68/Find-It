import React from "react";
import styles from "./TeamStatsSection.module.css";

const TeamStatsSection = ({ teamStats, recentResults }) => {
  return (
    <div className={styles.bottomSections}>
      {teamStats && (
        <div className={styles.sectionCard}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>ELO Moyen</span>
              <span className={styles.statValue}>{teamStats.averageElo}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Taux de victoire</span>
              <span className={styles.statValue}>{teamStats.winRate}%</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Matchs joués</span>
              <span className={styles.statValue}>{teamStats.totalMatches}</span>
            </div>
          </div>
          <p className={styles.sectionTitle}>Statistiques de l'équipe</p>
        </div>
      )}

      <div className={styles.sectionCard}>
        <div className={styles.resultsContainer}>
          {recentResults.split(" ").map((result, index) => (
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
        <p className={styles.sectionTitle}>Recents Résultats</p>
      </div>
    </div>
  );
};

export default TeamStatsSection;
