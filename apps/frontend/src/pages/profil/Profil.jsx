import React, { useState, useEffect } from "react";
import styles from "./Profil.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NavbarMobile from "../../components/NavbarMobile/NavbarMobile.jsx";
import ProfileBanner from "../../components/ProfileBanner/ProfileBanner.jsx";
import ProfileGameStats from "../../components/ProfileGameStats/ProfileGameStats.jsx";
import ProfileCommunities from "../../components/ProfileCommunities/ProfileCommunities.jsx";

const Profil = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          fetch("http://localhost:3000/users"),
          fetch("http://localhost:3000/faceit_stats"),
        ]);

        if (!usersRes.ok || !statsRes.ok) {
          throw new Error("Erreur lors du chargement du profil");
        }

        const [usersData, statsData] = await Promise.all([
          usersRes.json(),
          statsRes.json(),
        ]);

        const currentUser = (usersData || []).find(
          (u) => u.id === 1 || u.id === "1"
        );
        if (currentUser) {
          setUser(currentUser);
        }

        const userStats = (statsData || []).find(
          (stat) => stat.user_id === 1 || stat.user_id === "1"
        );
        if (userStats) {
          setStats(userStats);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    };

    loadProfileData();
  }, []);

  const handleEdit = () => {
    console.log("Édition du profil");
  };

  const handleEditBanner = () => {
    console.log("Édition de la bannière");
  };

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

          {user && (
            <ProfileBanner
              user={user}
              onEdit={handleEdit}
              onEditBanner={handleEditBanner}
            />
          )}

          <div className={styles.cardsGrid}>
            {stats && <ProfileGameStats stats={stats} />}
            {user && <ProfileCommunities user={user} />}
          </div>
        </div>
      </div>
      <NavbarMobile />
    </div>
  );
};

export default Profil;
