import React, { useState, useEffect } from "react";
import styles from "./TeamSearch.module.css";
import Navbar from "../Navbar/Navbar.jsx";
import NavbarMobile from "../NavbarMobile/NavbarMobile.jsx";
import CardLong from "../CardLong/CardLong.jsx";
import Button from "../button/Button.jsx";
import Modal from "../Modal/Modal.jsx";
import Input from "../Input/Input.jsx";
import { getTeams, createTeam, deleteTeam, joinTeam, getUserTeam, claimTeam } from "../../utils/api.js";
import { useAuth } from "../../utils/auth.jsx";
import teamsIcon from "../../assets/teams.png";
import arrowDownIcon from "../../assets/other-teams/arrow-down.svg";
import deleteIcon from "../../assets/other-teams/corbeille.svg";

const TeamSearch = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [availableRegions, setAvailableRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    region: "",
    eloAvg: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [canCreateTeam, setCanCreateTeam] = useState(false);
  const [userTeamId, setUserTeamId] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [claimableTeams, setClaimableTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTeams();
        setTeams(data);
        setFilteredTeams(data);

        const regions = [
          ...new Set(data.map((team) => team.region).filter(Boolean)),
        ].sort();
        setAvailableRegions(regions);

        if (user?.id) {
          console.log("User ID:", user.id, "Type:", typeof user.id);
          console.log("Teams data:", data.map(t => ({ id: t.id, captainId: t.captainId, name: t.name })));

          const userAsCaptain = data.find(team => team.captainId === user.id);
          console.log("User as captain:", userAsCaptain);

 
          const userTeams = data.filter(team =>
            !team.captainId && team.name.toLowerCase().includes('musashiii')
          );
          console.log("Claimable teams:", userTeams);
          setClaimableTeams(userTeams);

          if (userAsCaptain) {
            console.log("User is captain of team:", userAsCaptain.name);
            setUserTeamId(userAsCaptain.id);
            setCanCreateTeam(false);
          } else {
            console.log("User is not captain, can create/join teams");
            setUserTeamId(null);
            setCanCreateTeam(true);
          }
        } else {
          console.log("No user logged in");
          setUserTeamId(null);
          setCanCreateTeam(false);
          setClaimableTeams([]);
        }
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

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe ?")) {
      try {
        await deleteTeam(teamId);
        setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
      } catch (err) {
        setError("Impossible de supprimer l'équipe: " + err.message);
      }
    }
  };

  const handleCreateTeam = async () => {
    try {
      setIsCreating(true);
      const newTeam = await createTeam({
        name: createFormData.name,
        region: createFormData.region || null,
        eloAvg: createFormData.eloAvg ? Number(createFormData.eloAvg) : null,
      });

      setTeams((prev) => [...prev, newTeam]);
      setCanCreateTeam(false); 
      setIsCreateModalOpen(false);
      setCreateFormData({ name: "", region: "", eloAvg: "" });
    } catch (err) {
      if (err.message?.includes("USER_ALREADY_CAPTAIN")) {
        setError("Vous êtes déjà capitaine d'une équipe");
        setCanCreateTeam(false);
      } else {
        setError(err.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFormChange = (field, value) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClaimTeam = async (teamId) => {
    try {
      setIsJoining(true);
      await claimTeam(teamId);
      setUserTeamId(teamId); 
      setCanCreateTeam(false); 

      const updatedTeams = await getTeams();
      setTeams(updatedTeams);

      setClaimableTeams(prev => prev.filter(team => team.id !== teamId));
    } catch (err) {
      setError(err.message || "Erreur lors de la revendication de l'équipe");
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinTeam = async (teamId) => {
    if (!user?.id) {
      setError("Vous devez être connecté pour rejoindre une équipe");
      return;
    }

    if (userTeamId) {
      setError("Vous êtes déjà membre d'une équipe. Quittez-la d'abord pour en rejoindre une autre.");
      return;
    }

    try {
      setIsJoining(true);
      await joinTeam(teamId);
      setUserTeamId(teamId); 
      setCanCreateTeam(false); 

      const updatedTeams = await getTeams();
      setTeams(updatedTeams);
    } catch (err) {
      if (err.message?.includes("USER_ALREADY_MEMBER")) {
        setError("Vous êtes déjà membre de cette équipe");
      } else if (err.message?.includes("USER_ALREADY_IN_TEAM") || err.message?.includes("already in a team")) {
        setError("Vous êtes déjà dans une équipe. Quittez-la d'abord pour en rejoindre une autre.");
        setUserTeamId(-1); 
        setCanCreateTeam(false);
      } else {
        setError(err.message || "Erreur lors de la demande de rejoindre l'équipe");
      }
    } finally {
      setIsJoining(false);
    }
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
        <NavbarMobile />
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
        <NavbarMobile />
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
            {canCreateTeam ? (
              <Button
                text="Créer une équipe"
                onClick={() => setIsCreateModalOpen(true)}
              />
            ) : (
              <div className={styles.cannotCreate}>
                <span>Vous êtes déjà capitaine d'une équipe</span>
              </div>
            )}
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
              filteredTeams.map((team) => {
                const isUserTeam = team.id === userTeamId;
                const isCaptain = team.captainId === user?.id;
                const canJoin = !isUserTeam && !userTeamId && !!user?.id;
                const canClaim = claimableTeams.some(ct => ct.id === team.id);
                console.log(`Team ${team.name}: isUserTeam=${isUserTeam}, userTeamId=${userTeamId}, isCaptain=${isCaptain}, canJoin=${canJoin}, canClaim=${canClaim}`);

                return (
                  <CardLong
                    key={team.id}
                    icon={teamsIcon}
                    title={team.name}
                    subtitle={`ELO moyen : ${team.eloAvg ? team.eloAvg : 'N/A'}`}
                    timestamp={getRegionDisplay(team.region)}
                    onDelete={isCaptain ? () => handleDeleteTeam(team.id) : undefined}
                    deleteIcon={deleteIcon}
                    actionButton={
                      isUserTeam ? (
                        <span className={styles.teamStatus}>Votre équipe</span>
                      ) : canClaim ? (
                        <Button
                          text={isJoining ? "Revendiquer..." : "Revendiquer"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClaimTeam(team.id);
                          }}
                          disabled={isJoining}
                          size="small"
                        />
                      ) : canJoin ? (
                        <Button
                          text={isJoining ? "Rejoindre..." : "Rejoindre"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinTeam(team.id);
                          }}
                          disabled={isJoining}
                          size="small"
                        />
                      ) : null
                    }
                    bubbleVariant="pink"
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer une nouvelle équipe"
      >
        <div className={styles.createForm}>
          <div className={styles.formGroup}>
            <label htmlFor="teamName">Nom de l'équipe *</label>
            <Input
              type="text"
              id="teamName"
              value={createFormData.name}
              onChange={(e) => handleCreateFormChange("name", e.target.value)}
              placeholder="Entrez le nom de l'équipe"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="teamRegion">Région</label>
            <select
              id="teamRegion"
              value={createFormData.region}
              onChange={(e) => handleCreateFormChange("region", e.target.value)}
              className={styles.regionSelect}
            >
              <option value="">Sélectionner une région</option>
              <option value="Europe">Europe</option>
              <option value="Asie">Asie</option>
              <option value="Amérique">Amérique</option>
              <option value="Afrique">Afrique</option>
              <option value="Océanie">Océanie</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="teamElo">ELO moyen</label>
            <Input
              type="number"
              id="teamElo"
              value={createFormData.eloAvg}
              onChange={(e) => handleCreateFormChange("eloAvg", e.target.value)}
              placeholder="Entrez l'ELO moyen (optionnel)"
              min="0"
            />
          </div>

          <div className={styles.modalActions}>
            <Button
              text="Annuler"
              onClick={() => setIsCreateModalOpen(false)}
              variant="secondary"
            />
            <Button
              text={isCreating ? "Création..." : "Créer"}
              onClick={handleCreateTeam}
              disabled={isCreating || !createFormData.name.trim()}
            />
          </div>
        </div>
      </Modal>

      <NavbarMobile />
    </div>
  );
};

export default TeamSearch;
