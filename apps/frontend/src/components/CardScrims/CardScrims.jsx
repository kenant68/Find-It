import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth.jsx";
import { getTeamScrims, getMaps, getTeams, getUserTeam } from "../../utils/api.js";
import styles from "./CardScrims.module.css";

const CardScrims = () => {
  const [scrims, setScrims] = useState([]);
  const [maps, setMaps] = useState([]);
  const [teams, setTeams] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) {
        return;
      }

      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const userTeamData = await getUserTeam();
        setUserTeam(userTeamData);

        if (userTeamData) {
          const [scrimsData, mapsData, teamsData] = await Promise.all([
            getTeamScrims(userTeamData.id),
            getMaps(),
            getTeams(),
          ]);

          setScrims(scrimsData || []);
          setMaps(mapsData || []);
          setTeams(teamsData || []);
        } else {
          const [mapsData, teamsData] = await Promise.all([
            getMaps(),
            getTeams(),
          ]);
          setMaps(mapsData || []);
          setTeams(teamsData || []);
          setScrims([]);
        }

      } catch (err) {
        setError("Erreur lors du chargement des scrims");
        setUserTeam(null);
        setScrims([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getMapName = (mapId) => {
    const map = maps.find((m) => m.id === mapId);
    return map ? map.title : 'Carte inconnue';
  };

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Équipe inconnue';
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Scrims de l'équipe</h1>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}>
          Chargement...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Scrims de l'équipe</h1>
        <p style={{ color: "rgba(255, 100, 100, 0.9)", textAlign: "center" }}>
          {error}
        </p>
      </div>
    );
  }

  if (!userTeam) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Scrims de l'équipe</h1>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}>
          Vous n'êtes dans aucune équipe
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Scrims de l'équipe</h1>

      <div className={styles.list}>
        {scrims.length === 0 ? (
          <p style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}>
            {userTeam ? "Aucun scrim programmé" : "Vous n'êtes dans aucune équipe"}
          </p>
        ) : (
          scrims.map((scrim) => (
            <div key={scrim.id} className={styles.scrimCard}>
              <div className={styles.info}>
                <h2>{getTeamName(scrim.teamAId)} vs {getTeamName(scrim.teamBId)}</h2>
                <p className={styles.subtitle}>
                  Map: {getMapName(scrim.mapId)} | {scrim.horaire}
                </p>
                <p className={styles.status}>
                  Status: {scrim.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CardScrims;
