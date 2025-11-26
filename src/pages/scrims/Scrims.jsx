import React, { useState, useEffect } from "react";
import styles from "./Scrims.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import CardLong from "../../components/CardLong/CardLong.jsx";
import scrimIcon from "../../assets/scrims/scrim-swords.svg";

const Scrims = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrims, setScrims] = useState([]);

  useEffect(() => {
    const loadScrims = async () => {
      try {
        const response = await fetch("/db.json");
        const data = await response.json();

        const scrimsData = (data.scrimAnnouncements || []).map(
          (announcement) => ({
            id: announcement.id,
            title: `Annonce de ${announcement.teamName}`,
            timestamp: announcement.timestamp,
          })
        );

        setScrims(scrimsData);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des annonces de scrims:",
          error
        );
      }
    };

    loadScrims();
  }, []);

  const handleAccept = (id) => {
    setScrims((prevScrims) => prevScrims.filter((scrim) => scrim.id !== id));
  };

  const handleCreate = () => {
    console.log("Créer une nouvelle annonce de scrim");
  };

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
            <h1 className={styles.pageTitle}>Annonces de scrims</h1>
          </header>
          <div className={styles.cardsContainer}>
            {scrims.length === 0 ? (
              <p className={styles.emptyMessage}>
                Aucune annonce de scrim disponible
              </p>
            ) : (
              scrims.map((scrim) => (
                <CardLong
                  key={scrim.id}
                  icon={scrimIcon}
                  title={scrim.title}
                  timestamp={scrim.timestamp}
                  actionButton={
                    <button
                      className={styles.acceptButton}
                      onClick={() => handleAccept(scrim.id)}
                      type="button"
                    >
                      ACCEPTER
                    </button>
                  }
                />
              ))
            )}
          </div>
          <button
            className={styles.createButton}
            onClick={handleCreate}
            type="button"
          >
            CRÉER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scrims;
