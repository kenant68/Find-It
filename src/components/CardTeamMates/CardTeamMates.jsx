import React, { useEffect, useState } from "react";
import styles from "./CardTeamMates.module.css";

const CardTeamMates = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Joueurs</h1>

      <div className={styles.list}>
        {users.map((user) => (
          <div key={user.id} className={styles.playerCard}>
            <img
              src={user.avatar_url}
              alt={user.username}
              className={styles.avatar}
            />
            <div className={styles.info}>
              <h2>{user.username}</h2>
              <p className={styles.faceit_level}>
                Faceit Level: {user.faceit_level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardTeamMates;
