import React, { useEffect, useState } from "react";
import styles from "./CardStats.module.css";

const CardStats = () => {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer les stats de Musashiii_ (user_id: "1")
    fetch("http://localhost:3000/faceit_stats?user_id=1")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setStats(data[0]);
        }
      });

    // Récupérer les infos utilisateur
    fetch("http://localhost:3000/users/1")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  if (!stats || !user) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Statistiques de {user.username}</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Matchs joués</span>
          <span className={styles.statValue}>{stats.matches_played}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Victoires</span>
          <span className={styles.statValue}>{stats.wins}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Taux de victoire</span>
          <span className={styles.statValue}>{stats.win_rate}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>K/D moyen</span>
          <span className={styles.statValue}>{stats["average_K/D"]}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Taux de headshots</span>
          <span className={styles.statValue}>{stats.average_headshots}</span>
        </div>
      </div>

      <div className={styles.recentMatches}>
        <span className={styles.recentLabel}>Matchs récents:</span>
        <div className={styles.matchesList}>
          {stats.recent_matches.split(" ").map((match, index) => (
            <span
              key={index}
              className={`${styles.matchBadge} ${
                match === "W" ? styles.win : styles.loss
              }`}
            >
              {match}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardStats;
