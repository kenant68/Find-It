import React, { useEffect, useState } from "react";
import styles from "./Matchs.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";

const Matchs = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await fetch("/db.json");
        const data = await response.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.error("Erreur lors du chargement des matchs:", error);
      }
    };

    loadMatches();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <div
          className={`${styles.content} ${
            isCollapsed ? styles.contentCollapsed : ""
          }`}
        >
          <header className={styles.header}>
            <p className={styles.sectionLabel}>Liste des matchs</p>
            <h1 className={styles.pageTitle}>Historique des rencontres</h1>
          </header>
          <div className={styles.cardsContainer}>
            {matches.length === 0 ? (
              <p className={styles.statusMessage}>
                Aucun match n'a encore été disputé.
              </p>
            ) : (
              matches.map((match) => (
                <div key={match.id} className={styles.matchCard}>
                  <span className={styles.teamName}>{match.teamA}</span>
                  <div className={styles.scoreBlock}>
                    <span className={styles.scoreValue}>{match.scoreA}</span>
                    <span className={styles.scoreSeparator}>-</span>
                    <span className={styles.scoreValue}>{match.scoreB}</span>
                  </div>
                  <span className={styles.teamName}>{match.teamB}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matchs;
