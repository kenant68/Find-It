import React, { useState, useEffect } from "react";
import styles from "./Team.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NavbarMobile from "../../components/NavbarMobile/NavbarMobile.jsx";
import CardJoueur from "../../components/CardJoueur/CardJoueur.jsx";
import TeamStatsSection from "../../components/TeamStatsSection/TeamStatsSection.jsx";
import { getTeams, getTeamWithMembers, getFaceitStats } from "../../utils/api.js";
import { useAuth } from "../../utils/auth.jsx";

const Team = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [recentResults, setRecentResults] = useState("W L W W L");
  const [teamStats, setTeamStats] = useState(null);
  const [teamName, setTeamName] = useState("Mon équipe");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadTeamData = async () => {
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

        if (userTeam) {
          setTeamName(userTeam.name);

          const membersWithStats = await Promise.all(
            userTeam.members.map(async (member) => {
              try {
                const faceitStats = await getFaceitStats(member.user.id);
                return {
                  ...member.user,
                  isLeader: member.isLeader,
                  avatar: member.user.avatarUrl,
                  faceitLevel: faceitStats?.elo ? Math.floor(parseInt(faceitStats.elo) / 100) : 10,
                };
              } catch (err) {
                console.warn(`Stats FACEIT non disponibles pour ${member.user.username}`);
                return {
                  ...member.user,
                  isLeader: member.isLeader,
                  avatar: member.user.avatarUrl,
                  faceitLevel: 10, 
                };
              }
            })
          );

          setTeamMembers(membersWithStats);

          
          const validStats = membersWithStats.filter(m => m.faceitLevel && m.faceitLevel > 0);
          if (validStats.length > 0) {
            const totalElo = validStats.reduce((sum, m) => sum + (m.faceitLevel * 100), 0);
            const averageElo = Math.round(totalElo / validStats.length);

            setTeamStats({
              averageElo: averageElo,
              winRate: "65.2", // Valeur temporaire
              totalMatches: 42, // Valeur temporaire
            });
          }
        } else {
          setTeamName("Aucune équipe");
          setTeamMembers([]);
          setTeamStats(null);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données de l'équipe:", error);
        setError("Impossible de charger les données de l'équipe");
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [user]);

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
            <p className={styles.sectionLabel}>Mon équipe</p>
            <h1 className={styles.pageTitle}>{teamName || "Mon équipe"}</h1>
          </header>

          <div className={styles.membersSection}>
            {teamMembers.map((member) => (
              <CardJoueur
                key={member.id}
                member={member}
                avatar={member.avatar}
              />
            ))}
          </div>

          <TeamStatsSection
            teamStats={teamStats}
            recentResults={recentResults}
          />
        </div>
      </div>
      <NavbarMobile />
    </div>
  );
};

export default Team;