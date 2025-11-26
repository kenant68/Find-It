import React, { useState, useEffect } from "react";
import styles from "./CreateScrimModal.module.css";

const CreateScrimModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    teamName: "",
    horaire: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({ teamName: "", horaire: "" });
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.teamName.trim()) {
      return;
    }

    onSubmit({
      teamName: formData.teamName,
      horaire: formData.horaire,
    });

    setFormData({ teamName: "", horaire: "" });
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
          <h2 className={styles.modalTitle}>Créer une annonce de scrim</h2>
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
            <label htmlFor="teamName" className={styles.label}>
              Nom de l'équipe
            </label>
            <input
              type="text"
              id="teamName"
              className={styles.input}
              value={formData.teamName}
              onChange={(e) => handleInputChange("teamName", e.target.value)}
              placeholder="team_..."
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="horaire" className={styles.label}>
              Horaire
            </label>
            <input
              type="time"
              id="horaire"
              className={styles.input}
              value={formData.horaire}
              onChange={(e) => handleInputChange("horaire", e.target.value)}
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
