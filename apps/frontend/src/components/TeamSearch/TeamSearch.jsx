import React, { useState, useEffect } from "react";
import styles from "./TeamSearch.module.css";
import Navbar from "../Navbar/Navbar.jsx";
import CardLong from "../CardLong/CardLong.jsx";
import teamsIcon from "../../assets/teams.png";
import arrowDownIcon from "../../assets/other-teams/arrow-down.svg";
import deleteIcon from "../../assets/other-teams/corbeille.svg";

const TeamSearch = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [availableRegions, setAvailableRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("http://localhost:3000/teams");

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des équipes");
        }

        const data = await response.json();
        setTeams(data);
        setFilteredTeams(data);

        const regions = [
          ...new Set(data.map((team) => team.region).filter(Boolean)),
        ].sort();
        setAvailableRegions(regions);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors du chargement des équipes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    let filtered = [...teams];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((team) => team.region === selectedRegion);
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredTeams(filtered);
  }, [searchTerm, teams, selectedRegion]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const handleDeleteTeam = (teamId) => {
    setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
  };

  const getRegionDisplay = (region) => {
    if (!region) return "";
    const regionMap = {
      Europe: "EUROPE",
      Asie: "ASIE",
      Amérique: "AMÉRIQUE",
    };
    return regionMap[region] || region.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
          <div className={styles.content}>
            <p className={styles.loading}>Chargement des équipes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
          <div className={styles.content}>
            <p className={styles.error}>Erreur: {error}</p>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className={styles.pageTitle}>Equipes</h1>
          </header>

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Rechercher par nom"
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <div className={styles.selectWrapper}>
              <select
                className={styles.regionSelect}
                value={selectedRegion}
                onChange={handleRegionChange}
              >
                <option value="all">Toutes les régions</option>
                {availableRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <img
                src={arrowDownIcon}
                alt="Sélectionner"
                className={styles.selectArrow}
              />
            </div>
          </div>

          <div className={styles.teamsList}>
            {filteredTeams.length === 0 ? (
              <p className={styles.emptyMessage}>Aucune équipe trouvée</p>
            ) : (
              filteredTeams.map((team) => (
                <CardLong
                  key={team.id}
                  icon={teamsIcon}
                  title={team.name}
                  subtitle={`Rang moyen : FACEIT 10`}
                  timestamp={getRegionDisplay(team.region)}
                  onDelete={() => handleDeleteTeam(team.id)}
                  deleteIcon={deleteIcon}
                  bubbleVariant="pink"
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSearch;
