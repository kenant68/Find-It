import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth.jsx";
import { getFaceitStats, getUserById } from "../../utils/api.js";
import styles from "./CardStats.module.css";

const CardStats = () => {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      if (!authUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [userData, faceitStats] = await Promise.all([
          getUserById(authUser.id),
          getFaceitStats(authUser.id).catch(() => null) // FACEIT peut échouer
        ]);

        setUser(userData);
        setStats(faceitStats);
      } catch (err) {
        console.error("Erreur lors du chargement des stats:", err);
        setError("Erreur lors du chargement des stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [authUser]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Chargement des stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Utilisateur non trouvé</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Statistiques de {user.username}</h1>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center", marginTop: "20px" }}>
          Statistiques FACEIT non disponibles.<br />
          Configurez votre ID FACEIT dans votre profil.
        </p>
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
