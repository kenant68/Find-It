import React from "react";
import styles from "./CardLong.module.css";
import Bubble from "../Bubble/Bubble.jsx";
import defaultDeleteIcon from "../../assets/notifs/X.svg";

const CardLong = ({
  icon,
  title,
  subtitle,
  timestamp,
  onDelete,
  actionButton,
  deleteIcon,
  bubbleVariant,
}) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const iconToUse = deleteIcon || defaultDeleteIcon;

  return (
    <div className={styles.card}>
      <Bubble variant={bubbleVariant}>
        <img src={icon} alt={title} />
      </Bubble>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.rightSection}>
        <p className={styles.timestamp}>{timestamp}</p>
        {actionButton && (
          <div className={styles.actionButtonContainer}>{actionButton}</div>
        )}
        {onDelete && (
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="Supprimer"
            type="button"
          >
            <img src={iconToUse} alt="Supprimer" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CardLong;
