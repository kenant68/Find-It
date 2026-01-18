import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth.jsx";
import { getTeams, getTeamWithMembers, getImageUrl } from "../../utils/api.js";
import styles from "./CardTeamMates.module.css";

const CardTeamMates = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadTeamData = async () => {
      if (authLoading) {
        return;
      }

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const allTeams = await getTeams();

        let userTeam = null;
        for (const team of allTeams) {
          try {
            const teamWithMembers = await getTeamWithMembers(team.id);
            const isMember = teamWithMembers.members.some(member => member.userId === user.id);
            if (isMember) {
              userTeam = teamWithMembers;
              break;
            }
          } catch (err) {
            console.warn(`Erreur vérification équipe ${team.id}:`, err);
          }
        }

        setTeam(userTeam);

      } catch (err) {
        console.error("Erreur lors du chargement de l'équipe:", err);
        setError("Erreur lors du chargement de l'équipe");
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [user?.id, authLoading]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Joueurs de l'équipe</h1>
        <p>Chargement de l'équipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Joueurs de l'équipe</h1>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Joueurs de l'équipe</h1>
        <p>Vous n'êtes dans aucune équipe</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Équipe: {team.name}</h1>

      <div className={styles.list}>
        {team.members && team.members.map((member) => (
          <div key={member.userId} className={styles.playerCard}>
            <img
              src={getImageUrl(member.user.avatarUrl) || "/default-avatar.png"}
              alt={member.user.username}
              className={styles.avatar}
            />
            <div className={styles.info}>
              <h2>{member.user.username}</h2>
              <p className={styles.role}>
                {member.isLeader ? "Capitaine" : "Joueur"}
              </p>
              {member.user.faceitId && (
                <p className={styles.faceit}>
                  FACEIT: {member.user.faceitId}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardTeamMates;
