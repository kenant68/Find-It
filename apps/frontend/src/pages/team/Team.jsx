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
        const [membersRes, teamsRes, statsRes] = await Promise.all([
          fetch("http://localhost:3000/teamMembers"),
          fetch("http://localhost:3000/teams"),
          fetch("http://localhost:3000/faceit_stats"),
        ]);

        if (!membersRes.ok || !teamsRes.ok || !statsRes.ok) {
          throw new Error("Erreur lors du chargement des données de l'équipe");
        }

        const [membersData, teamsData, statsData] = await Promise.all([
          membersRes.json(),
          teamsRes.json(),
          statsRes.json(),
        ]);

        let recentResults = "W L W W L";
        let currentTeam = null;

        try {
          const dbRes = await fetch("http://localhost:3000/");
          if (dbRes.ok) {
            const dbData = await dbRes.json();
            recentResults = dbData.teamRecentResults || "W L W W L";
            currentTeam = dbData.currentTeam || null;
          }
        } catch (e) {
          console.warn("Impossible de charger db.json, utilisation des valeurs par défaut");
        }

        const membersArray = Array.isArray(membersData)
          ? membersData
          : [membersData];
        const membersWithAvatars = membersArray.map((member) => ({
          ...member,
          avatar: getAvatar(member.avatar),
        }));

        setTeamMembers(membersWithAvatars);
        setRecentResults(recentResults);

        if (currentTeam && currentTeam.id) {
          const team = (teamsData || []).find(
            (t) => t.id == currentTeam.id || t.id === currentTeam.id
          );
          setTeamName(team ? team.name : currentTeam.name);
        } else if (teamsData && teamsData.length > 0) {
          setTeamName(teamsData[0].name);
        }

        if (statsData && statsData.length > 0) {
          const stats = Array.isArray(statsData) ? statsData : [statsData];
          const totalElo = stats.reduce(
            (sum, stat) => sum + parseInt(stat.elo || 0),
            0
          );
          const totalWins = stats.reduce(
            (sum, stat) => sum + parseInt(stat.wins || 0),
            0
          );
          const totalMatches = stats.reduce(
            (sum, stat) => sum + parseInt(stat.matches_played || 0),
            0
          );

          const teamWinRate =
            totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;

          setTeamStats({
            averageElo: stats.length > 0 ? Math.round(totalElo / stats.length) : 0,
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
