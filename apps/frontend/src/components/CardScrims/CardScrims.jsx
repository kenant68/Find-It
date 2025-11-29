import React, { useEffect, useState } from "react";
import styles from "./CardScrims.module.css";

const CardScrims = () => {
  const [scrims, setScrims] = useState([]);
  const [maps, setMaps] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [scrimsRes, mapsRes, teamsRes] = await Promise.all([
          fetch("http://localhost:3000/scrims"),
          fetch("http://localhost:3000/maps"),
          fetch("http://localhost:3000/teams"),
        ]);

        if (!scrimsRes.ok) {
          throw new Error(
            `Erreur ${scrimsRes.status}: Impossible de charger les scrims`
          );
        }

        if (!mapsRes.ok) {
          throw new Error(
            `Erreur ${mapsRes.status}: Impossible de charger les maps`
          );
        }

        if (!teamsRes.ok) {
          throw new Error(
            `Erreur ${teamsRes.status}: Impossible de charger les équipes`
          );
        }

        const [scrimsData, mapsData, teamsData] = await Promise.all([
          scrimsRes.json(),
          mapsRes.json(),
          teamsRes.json(),
        ]);

        if (
          !Array.isArray(scrimsData) ||
          !Array.isArray(mapsData) ||
          !Array.isArray(teamsData)
        ) {
          throw new Error("Format de données invalide");
        }

        setScrims(scrimsData);
        setMaps(mapsData);
        setTeams(teamsData);
      } catch (err) {
        if (err.name === "TypeError" && err.message.includes("fetch")) {
          setError(
            "Impossible de se connecter au serveur. Assurez-vous que json-server est démarré (pnpm json-server)"
          );
        } else {
          setError(
            err.message ||
              "Une erreur est survenue lors du chargement des scrims"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMap = (id) => maps.find((m) => m.id == id);
  const getTeam = (id) => teams.find((t) => t.id == id);

  const validScrims = scrims.filter((scrim) => {
    const map = getMap(scrim.mapId);
    const teamA = getTeam(scrim.teamA);
    const teamB = getTeam(scrim.teamB);
    return map && teamA && teamB;
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Scrims à venir</h1>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}>
          Chargement...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Scrims à venir</h1>
        <p style={{ color: "rgba(255, 100, 100, 0.9)", textAlign: "center" }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Scrims à venir</h1>

      <div className={styles.list}>
        {validScrims.length === 0 ? (
          <p style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}>
            Aucun scrim à venir
          </p>
        ) : (
          validScrims.map((scrim) => {
            const map = getMap(scrim.mapId);
            const teamA = getTeam(scrim.teamA);
            const teamB = getTeam(scrim.teamB);

            return (
              <div key={scrim.id} className={styles.scrimCard}>
                <img src={map.img} alt={map.title} className={styles.image} />
                <div className={styles.info}>
                  <h2>{map.title}</h2>
                  <p className={styles.horaire}>🕒 {scrim.horaire}</p>
                  <p className={styles.vs}>
                    {teamA.name} <span className={styles.separator}>VS</span>{" "}
                    {teamB.name}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CardScrims;
