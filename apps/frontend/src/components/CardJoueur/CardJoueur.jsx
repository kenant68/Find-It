import React from "react";
import styles from "./CardJoueur.module.css";
import crownIcon from "../../assets/team/Crown.svg";
import faceitIcon from "../../assets/team/10.png";

const CardJoueur = ({ member, avatar }) => {
  return (
    <div
      className={`${styles.memberCard} ${
        member.isLeader ? styles.leaderCard : ""
      }`}
    >
      {member.isLeader && (
        <img src={crownIcon} alt="Leader" className={styles.crownIcon} />
      )}
      <div className={styles.avatarContainer}>
        <img src={avatar} alt={member.username} className={styles.avatar} />
      </div>
      <p className={styles.username}>{member.username}</p>
      <div className={styles.faceitBadge}>
        <img src={faceitIcon} alt={`FACEIT ${member.faceitLevel}`} />
      </div>
    </div>
  );
};

export default CardJoueur;
