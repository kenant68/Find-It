import React, { useState, useEffect } from "react";
import styles from "./CreateScrimModal.module.css";
import { getTeams, getMaps } from "../../utils/api.js";

const CreateScrimModal = ({ isOpen, onClose, onSubmit, userTeam }) => {
  const [formData, setFormData] = useState({
    opponentTeamId: "",
    mapId: "",
    time: "",
  });
  const [teams, setTeams] = useState([]);
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ opponentTeamId: "", mapId: "", time: "" });
      setTeams([]);
      setMaps([]);
    } else {
      
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, mapsData] = await Promise.all([
        getTeams(),
        getMaps()
      ]);

      const availableTeams = teamsData.filter(team => team.id !== userTeam?.id);
      setTeams(availableTeams);
      setMaps(mapsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.opponentTeamId || !formData.mapId || !formData.time) {
      return;
    }

    onSubmit({
      opponentTeamId: parseInt(formData.opponentTeamId),
      mapId: parseInt(formData.mapId),
      time: formData.time,
    });

    setFormData({ opponentTeamId: "", mapId: "", time: "" });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Créer un scrim</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="opponentTeam" className={styles.label}>
              Équipe adverse
            </label>
            <select
              id="opponentTeam"
              className={styles.select}
              value={formData.opponentTeamId}
              onChange={(e) => handleInputChange("opponentTeamId", e.target.value)}
              required
            >
              <option value="">Choisir une équipe</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="map" className={styles.label}>
              Carte
            </label>
            <select
              id="map"
              className={styles.select}
              value={formData.mapId}
              onChange={(e) => handleInputChange("mapId", e.target.value)}
              required
            >
              <option value="">Choisir une carte</option>
              {maps.map(map => (
                <option key={map.id} value={map.id}>
                  {map.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="time" className={styles.label}>
              Horaire
            </label>
            <input
              type="time"
              id="time"
              className={styles.input}
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              required
            />
          </div>
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Annuler
            </button>
            <button type="submit" className={styles.submitButton}>
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScrimModal;
