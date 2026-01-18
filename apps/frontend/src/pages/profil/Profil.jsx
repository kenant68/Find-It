import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/auth.jsx";
import { getUserById, getFaceitStats, updateUser } from "../../utils/api.js";
import styles from "./Profil.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NavbarMobile from "../../components/NavbarMobile/NavbarMobile.jsx";
import ProfileBanner from "../../components/ProfileBanner/ProfileBanner.jsx";
import ProfileGameStats from "../../components/ProfileGameStats/ProfileGameStats.jsx";
import ProfileCommunities from "../../components/ProfileCommunities/ProfileCommunities.jsx";
import ImageUpload from "../../components/ImageUpload/ImageUpload.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/button/Button.jsx";

const Profil = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [faceitStats, setFaceitStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [editValue, setEditValue] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userData = await getUserById(user.id);
        setUserDetails(userData);

        try {
          const stats = await getFaceitStats(user.id);
          setFaceitStats(stats);
        } catch (statsError) {
        }

      } catch (error) {
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user?.id]);


  const handleAvatarUpdate = (newAvatarUrl) => {
    setUserDetails(prev => prev ? { ...prev, avatarUrl: newAvatarUrl } : null);
  };

  const handleBannerUpdate = (newBannerUrl) => {
    setUserDetails(prev => prev ? { ...prev, bannerUrl: newBannerUrl } : null);
  };

  const handleEditUsername = () => {
    setEditValue(userDetails?.username || "");
    setActiveModal("username");
  };

  const handleEditSteam = () => {
    setEditValue(userDetails?.steamUrl || "");
    setActiveModal("steam");
  };

  const handleEditDiscord = () => {
    setEditValue(userDetails?.discordUsername || "");
    setActiveModal("discord");
  };

  const handleEditRegion = () => {
    setEditValue(userDetails?.region || "");
    setActiveModal("region");
  };

  const handleEditFaceit = () => {
    setEditValue(userDetails?.faceitId || "");
    setActiveModal("username");
  };

  const handleSaveEdit = async () => {
    if (!activeModal) return;

      try {
        setLoading(true);
        const fieldMapping = {
          username: "faceitId",
          steam: "steamUrl",
          discord: "discordUsername",
          region: "region"
        };

        const updateData = { [fieldMapping[activeModal]]: editValue };

        await updateUser(user.id, updateData);

        const updatedUser = await getUserById(user.id);
        setUserDetails(updatedUser);

      setActiveModal(null);
      setEditValue("");
    } catch (error) {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setEditValue("");
  };

  const handleProfileUpdate = async () => {
    try {
      const updatedUser = await getUserById(user.id);
      setUserDetails(updatedUser);
    } catch (error) {
    }
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
          <div className={`${styles.content} ${isCollapsed ? styles.contentCollapsed : ""}`}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <p>Chargement du profil...</p>
            </div>
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
          <div className={`${styles.content} ${isCollapsed ? styles.contentCollapsed : ""}`}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <p style={{ color: 'red' }}>{error}</p>
            </div>
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
            <h1 className={styles.pageTitle}>Profil</h1>
          </header>


          <div className={styles.profileContent}>
            {userDetails && (
            <ProfileBanner
                user={userDetails}
                bannerUrl={userDetails.bannerUrl}
                onBannerUpdate={handleBannerUpdate}
                onEditUsername={handleEditUsername}
                onAvatarUpdate={handleAvatarUpdate}
            />
          )}

          <div className={styles.cardsGrid}>
              {faceitStats && <ProfileGameStats stats={faceitStats} />}
              {userDetails && (
                <ProfileCommunities
                  user={userDetails}
                  onEditSteam={handleEditSteam}
                  onEditDiscord={handleEditDiscord}
                  onEditRegion={handleEditRegion}
                  onEditFaceit={handleEditFaceit}
                />
              )}
            </div>
          </div>

   
          <Modal
            isOpen={activeModal === "avatar"}
            onClose={handleCloseModal}
            title="Modifier l'avatar"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: '#ffffff', margin: 0 }}>
                Fonctionnalité à venir : téléchargement d'image personnalisée
              </p>
              <Input
                name="URL de l'avatar"
                type="url"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="https://exemple.com/avatar.jpg"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button onClick={() => {
                  handleCloseModal();
                }} disabled={loading}>
                  Sauvegarder
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={activeModal === "banner"}
            onClose={handleCloseModal}
            title="Modifier la bannière"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: '#ffffff', margin: 0 }}>
                Entrez l'URL de votre nouvelle bannière
              </p>
              <Input
                name="URL de la bannière"
                type="url"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="https://exemple.com/banner.jpg"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button onClick={handleSaveEdit} disabled={loading}>
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={activeModal === "username"}
            onClose={handleCloseModal}
            title="Modifier l'ID FACEIT"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                name="ID FACEIT"
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Votre ID ou pseudo FACEIT"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button onClick={handleSaveEdit} disabled={loading}>
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={activeModal === "steam"}
            onClose={handleCloseModal}
            title="Modifier le profil Steam"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                name="Profil Steam"
                type="url"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="https://steamcommunity.com/..."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button onClick={handleSaveEdit} disabled={loading}>
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={activeModal === "discord"}
            onClose={handleCloseModal}
            title="Modifier le nom Discord"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                name="Nom Discord"
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="VotreNom#1234"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button onClick={handleSaveEdit} disabled={loading}>
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={activeModal === "region"}
            onClose={handleCloseModal}
            title="Modifier la région"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                name="Région"
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="EU, NA, ASIA, etc."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button onClick={handleSaveEdit} disabled={loading}>
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
          </div>
            </div>
          </Modal>
        </div>
      </div>
      <NavbarMobile />
    </div>
  );
};

export default Profil;
