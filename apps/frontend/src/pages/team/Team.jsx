import React, { useState, useEffect } from "react";
import styles from "./Team.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NavbarMobile from "../../components/NavbarMobile/NavbarMobile.jsx";
import CardJoueur from "../../components/CardJoueur/CardJoueur.jsx";
import TeamStatsSection from "../../components/TeamStatsSection/TeamStatsSection.jsx";
import { getTeams, getTeamWithMembers, getFaceitStats, getImageUrl } from "../../utils/api.js";
import { useAuth } from "../../utils/auth.jsx";

const Team = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [recentResults] = useState("W L W W L");
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

          let totalElo = 0;
          let totalWins = 0;
          let totalMatches = 0;
          let membersWithElo = 0;

          const membersWithStats = await Promise.all(
            userTeam.members.map(async (member) => {
              try {
                const faceitStats = await getFaceitStats(member.user.id);
                
                if (faceitStats) {
                  if (faceitStats.elo) {
                    totalElo += parseInt(faceitStats.elo) || 0;
                    membersWithElo++;
                  }
                  totalWins += parseInt(faceitStats.wins) || 0;
                  totalMatches += parseInt(faceitStats.matches_played) || 0;
                }

                return {
                  ...member.user,
                  isLeader: member.isLeader,
                  avatar: getImageUrl(member.user.avatarUrl),
                  elo: faceitStats?.elo || 0,
                  faceitLevel: faceitStats?.elo ? Math.min(10, Math.max(1, Math.floor(parseInt(faceitStats.elo) / 250))) : null,
                };
              } catch (err) {
                console.warn(`Stats FACEIT non disponibles pour ${member.user.username}`);
                return {
                  ...member.user,
                  isLeader: member.isLeader,
                  avatar: getImageUrl(member.user.avatarUrl),
                  elo: 0,
                  faceitLevel: null,
                };
              }
            })
          );

          setTeamMembers(membersWithStats);

          const averageElo = membersWithElo > 0 ? Math.round(totalElo / membersWithElo) : 0;
          const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : "0";

          setTeamStats({
            averageElo: averageElo,
            winRate: winRate,
            totalMatches: totalMatches,
          });
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