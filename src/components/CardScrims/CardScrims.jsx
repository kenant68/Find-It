import React, { useEffect, useState } from "react";
import styles from "./CardScrims.module.css";

const CardScrims = () => {
    const [scrims, setScrims] = useState([]);
    const [maps, setMaps] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/scrims")
            .then(res => res.json())
            .then(data => setScrims(data));

        fetch("http://localhost:3001/maps")
            .then(res => res.json())
            .then(data => setMaps(data));

        fetch("http://localhost:3001/teams")
            .then(res => res.json())
            .then(data => setTeams(data));
    }, []);

    const getMap = id => maps.find(m => m.id === id);
    const getTeam = id => teams.find(t => t.id === id);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Scrims à venir</h1>

            <div className={styles.list}>
                {scrims.map(scrim => {
                    const map = getMap(scrim.mapId);
                    const teamA = getTeam(scrim.teamA);
                    const teamB = getTeam(scrim.teamB);

                    if (!map || !teamA || !teamB) return null;

                    return (
                        <div key={scrim.id} className={styles.card}>
                            <img src={map.img} alt={map.title} className={styles.image} />
                            <div className={styles.info}>
                                <h2>{map.title}</h2>
                                <p>🕒 {scrim.horaire}</p>
                                <p>{teamA.name} VS {teamB.name}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CardScrims;
