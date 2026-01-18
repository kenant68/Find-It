import React, { useState, useEffect } from "react";
import styles from "./Scrims.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NavbarMobile from "../../components/NavbarMobile/NavbarMobile.jsx";
import CardLong from "../../components/CardLong/CardLong.jsx";
import CreateScrimModal from "../../components/CreateScrimModal/CreateScrimModal.jsx";
import { getScrims, getTeams, getMaps, createScrim, getUserTeam, deleteScrim } from "../../utils/api.js";
import { useAuth } from "../../utils/auth.jsx";
import scrimIcon from "../../assets/scrims/scrim-swords.svg";

const Scrims = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrims, setScrims] = useState([]);
  const [teams, setTeams] = useState([]);
  const [maps, setMaps] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger scrims, équipes et maps en parallèle
        const [scrimsData, teamsData, mapsData] = await Promise.all([
          getScrims(),
          getTeams(),
          getMaps()
        ]);

        setScrims(scrimsData || []);
        setTeams(teamsData || []);
        setMaps(mapsData || []);

        if (user?.id) {
          try {
            const userTeamData = await getUserTeam();
            setUserTeam(userTeamData);
          } catch (err) {
            const userAsCaptain = teamsData?.find(team => team.captainId === user.id);
            if (userAsCaptain) {
              setUserTeam(userAsCaptain);
            } else {
              setUserTeam(null);
            }
          }
        }
      } catch (error) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : `Équipe ${teamId}`;
  };

  const getMapName = (mapId) => {
    const map = maps.find(m => m.id === mapId);
    return map ? map.title : `Carte ${mapId}`;
  };

  const handleJoinScrim = async (scrimId) => {

    setScrims((prevScrims) => prevScrims.filter((scrim) => scrim.id !== scrimId));
  };

  const handleCancelScrim = async (scrimId) => {
    try {
      await deleteScrim(scrimId);
      setScrims((prevScrims) => prevScrims.filter((scrim) => scrim.id !== scrimId));
    } catch (error) {
      if (error.message?.includes('404') || error.message?.includes('Scrim not found')) {
        setScrims((prevScrims) => prevScrims.filter((scrim) => scrim.id !== scrimId));
      } else {
        setError("Erreur lors de l'annulation du scrim: " + error.message);
      }
    }
  };

  const handleCreate = () => {
    if (!userTeam) {
      setError("Vous devez être dans une équipe pour créer un scrim");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      const scrimData = {
        teamAId: userTeam.id,
        teamBId: formData.opponentTeamId,
        mapId: formData.mapId,
        horaire: formData.time,
        status: "scheduled"
      };

      const newScrim = await createScrim(scrimData);

      const updatedScrims = await getScrims();
      setScrims(updatedScrims || []);

      setIsModalOpen(false);
    } catch (error) {
      setError(error.message || "Erreur lors de la création du scrim");
    }
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
          {loading ? (
            <div className={styles.loading}>
              <p>Chargement des scrims...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Erreur: {error}</p>
            </div>
          ) : (
            <div className={styles.cardsContainer}>
              {scrims.length === 0 ? (
                <p className={styles.emptyMessage}>
                  Aucun scrim disponible
                </p>
              ) : (
                scrims.map((scrim) => (
                  <CardLong
                    key={scrim.id}
                    icon={scrimIcon}
                    title={`${getTeamName(scrim.teamAId)} vs ${getTeamName(scrim.teamBId)}`}
                    subtitle={`Map: ${getMapName(scrim.mapId)} | ${scrim.horaire}`}
                    timestamp={`Status: ${scrim.status}`}
                    actionButton={
                      userTeam && (scrim.teamAId === userTeam.id || scrim.teamBId === userTeam.id) ? (
                        <button
                          className={`${styles.cancelButton} ${styles.dangerButton}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Êtes-vous sûr de vouloir annuler ce scrim ?")) {
                              handleCancelScrim(scrim.id);
                            }
                          }}
                          type="button"
                        >
                          ANNULER
                        </button>
                      ) : (
                        <button
                          className={styles.acceptButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinScrim(scrim.id);
                          }}
                          type="button"
                        >
                          REJOINDRE
                        </button>
                      )
                    }
                  />
                ))
              )}
            </div>
          )}
          <button
            className={styles.createButton}
            onClick={handleCreate}
            type="button"
          >
            CRÉER
          </button>
        </div>
      </div>

      <CreateScrimModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
      <NavbarMobile />
    </div>
  );
};

export default Scrims;
