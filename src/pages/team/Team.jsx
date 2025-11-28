import React, { useState, useEffect } from "react";
import styles from "./Team.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import CardJoueur from "../../components/CardJoueur/CardJoueur.jsx";
import TeamStatsSection from "../../components/TeamStatsSection/TeamStatsSection.jsx";
import { getAvatar } from "../../utils/avatarUtils.js";

const Team = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [recentResults, setRecentResults] = useState("");
  const [teamStats, setTeamStats] = useState(null);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const response = await fetch("/db.json");
        const data = await response.json();

        const membersData = (data.teamMembers || []).map((member) => ({
          ...member,
          avatar: getAvatar(member.avatar),
        }));

        setTeamMembers(membersData);
        setRecentResults(data.teamRecentResults || "W L W W L");

        if (data.currentTeam) {
          const team = (data.teams || []).find(
            (t) => t.id === data.currentTeam.id
          );
          setTeamName(team ? team.name : data.currentTeam.name);
        } else if (data.teams && data.teams.length > 0) {
          setTeamName(data.teams[0].name);
        }

        if (data.faceit_stats && data.faceit_stats.length > 0) {
          const stats = data.faceit_stats;
          const totalElo = stats.reduce(
            (sum, stat) => sum + parseInt(stat.elo),
            0
          );
          const totalWins = stats.reduce(
            (sum, stat) => sum + parseInt(stat.wins),
            0
          );
          const totalMatches = stats.reduce(
            (sum, stat) => sum + parseInt(stat.matches_played),
            0
          );

          const teamWinRate =
            totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;

          setTeamStats({
            averageElo: Math.round(totalElo / stats.length),
            winRate: teamWinRate.toFixed(1),
            totalMatches: totalMatches,
          });
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données de l'équipe:",
          error
        );
      }
    };

    loadTeamData();
  }, []);

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
    </div>
  );
};

export default Team;
