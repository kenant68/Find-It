import React, { useEffect, useState } from "react";
import styles from "./CardFavStat.module.css";

const CardFavStat = () => {
  const [stats, setStats] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/faceit_stats?user_id=1")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setStats(data[0]);
          fetch("http://localhost:3000/maps")
            .then((res) => res.json())
            .then((maps) => {
              const favoriteMap = maps.find((m) => m.title === data[0].fav_map);
              if (favoriteMap) {
                setMap(favoriteMap);
              }
            });
        }
      });
  }, []);

  if (!stats || !map) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Statistiques favorites</h1>

      <div className={styles.card}>
        <img src={map.img} alt={map.title} className={styles.image} />
        <div className={styles.info}>
          <h2 className={styles.mapName}>{stats.fav_map}</h2>
          <p className={styles.statItem}>
            <span className={styles.statLabel}>Taux de victoire :</span>
            <span className={styles.statValue}>{stats.fav_map_win_rate}</span>
          </p>
          <p className={styles.statItem}>
            <span className={styles.statLabel}>Côté favori:</span>
            <span className={styles.statValue}>{stats.fav_side}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardFavStat;
