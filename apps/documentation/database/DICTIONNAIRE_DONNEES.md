# Dictionnaire des Données - Find-It

**Version :** 2.0.0  
**Date :** 18 janvier 2026

Ce document décrit en détail toutes les entités, attributs et relations de la base de données Find-It.

> **Note importante :** Les statistiques FACEIT (ELO, matchs, win rate, etc.) ne sont **pas stockées** en base de données. Elles sont récupérées en temps réel via l'API FACEIT externe à chaque requête. Seul le `faceit_id` de l'utilisateur est stocké pour permettre la récupération des données.

---

## Table USERS

**Description :** Stocke les informations des utilisateurs (joueurs) de la plateforme.

| Attribut           | Type         | Contraintes                  | Description                                                       |
| ------------------ | ------------ | ---------------------------- | ----------------------------------------------------------------- |
| `id`               | INTEGER      | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique de l'utilisateur                               |
| `username`         | VARCHAR(100) | NOT NULL, UNIQUE             | Nom d'utilisateur unique                                          |
| `email`            | VARCHAR(255) | NOT NULL, UNIQUE             | Adresse email unique                                              |
| `password_hash`    | VARCHAR(255) | NOT NULL                     | Hash du mot de passe (bcrypt)                                     |
| `avatar_url`       | VARCHAR(500) | NULL                         | URL de l'avatar du joueur                                         |
| `banner_url`       | VARCHAR(500) | NULL                         | URL de la bannière de profil                                      |
| `faceit_id`        | VARCHAR(100) | NULL                         | Nickname ou UUID FACEIT (pour récupérer les stats via API externe)|
| `faceit_level`     | VARCHAR(10)  | NULL                         | Niveau FACEIT (1-10) - mis à jour lors de la récupération         |
| `steam_url`        | VARCHAR(500) | NULL                         | URL du profil Steam                                               |
| `discord_username` | VARCHAR(100) | NULL                         | Nom d'utilisateur Discord                                         |
| `region`           | VARCHAR(50)  | NULL                         | Région géographique du joueur                                     |
| `created_at`       | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Date et heure de création du compte                               |
| `updated_at`       | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Date et heure de dernière mise à jour                             |

**Relations :**

- Un utilisateur peut être membre d'une seule équipe (via `TEAM_MEMBERS`)
- Un utilisateur peut recevoir plusieurs notifications (via `NOTIFICATIONS`)
- Un utilisateur peut être capitaine d'une équipe (via `TEAMS.captain_id`)
- Le `faceit_id` permet de récupérer les statistiques FACEIT en temps réel via l'API externe (données non stockées)

**Index :**

- PRIMARY KEY (`id`)
- UNIQUE (`username`)
- UNIQUE (`email`)
- INDEX (`faceit_id`)
- INDEX (`region`)

---

## Table TEAMS

**Description :** Stocke les informations des équipes de joueurs.

| Attribut     | Type         | Contraintes                  | Description                           |
| ------------ | ------------ | ---------------------------- | ------------------------------------- |
| `id`         | INTEGER      | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique de l'équipe        |
| `name`       | VARCHAR(100) | NOT NULL, UNIQUE             | Nom de l'équipe (unique)              |
| `logo_url`   | VARCHAR(500) | NULL                         | URL du logo de l'équipe               |
| `banner_url` | VARCHAR(500) | NULL                         | URL de la bannière de l'équipe        |
| `captain_id` | INTEGER      | FK → USERS.id, NULL          | Identifiant du capitaine de l'équipe  |
| `elo_avg`    | INTEGER      | NULL                         | ELO moyen de l'équipe                 |
| `region`     | VARCHAR(50)  | NULL                         | Région géographique de l'équipe       |
| `created_at` | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Date et heure de création de l'équipe |
| `updated_at` | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Date et heure de dernière mise à jour |

**Relations :**

- Une équipe a plusieurs membres (via `TEAM_MEMBERS`)
- Une équipe peut créer/participer à plusieurs scrims (via `SCRIMS`)
- Une équipe peut jouer plusieurs matchs (via `MATCHES`)
- Une équipe peut créer plusieurs annonces de scrims (via `SCRIM_ANNOUNCEMENTS`)
- Une équipe a un capitaine (via `captain_id` → `USERS.id`)

**Index :**

- PRIMARY KEY (`id`)
- UNIQUE (`name`)
- FOREIGN KEY (`captain_id`) REFERENCES `USERS(id)`
- INDEX (`region`)
- INDEX (`elo_avg`)

---

## Table TEAM_MEMBERS

**Description :** Stocke les informations des membres d'une équipe avec leurs détails de profil.

| Attribut     | Type        | Contraintes             | Description                                                 |
| ------------ | ----------- | ----------------------- | ----------------------------------------------------------- |
| `id`         | VARCHAR(36) | PK, NOT NULL            | Identifiant unique du membre                                |
| `username`   | VARCHAR(100)| NOT NULL                | Nom d'utilisateur du joueur                                 |
| `avatar`     | VARCHAR(200)| NULL                    | Nom du fichier avatar (ex: "ef-gold-pfp.svg")               |
| `faceitLevel`| INTEGER     | NULL                    | Niveau FACEIT du joueur (1-10)                              |
| `isLeader`   | BOOLEAN     | NOT NULL, DEFAULT FALSE | Indique si le joueur est le leader de l'équipe              |

**Notes :**

- Cette table contient une vue dénormalisée des membres pour affichage rapide
- Les données détaillées des utilisateurs sont dans la table USERS

**Index :**

- PRIMARY KEY (`id`)
- INDEX (`username`)

---

## Table MAPS

**Description :** Stocke les informations des maps de Counter-Strike disponibles pour les scrims et matchs.

| Attribut | Type         | Contraintes                  | Description                                     |
| -------- | ------------ | ---------------------------- | ----------------------------------------------- |
| `id`     | INTEGER      | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique de la map                    |
| `title`  | VARCHAR(100) | NOT NULL, UNIQUE             | Nom de la map (ex: "Mirage", "Nuke", "Inferno") |
| `img`    | VARCHAR(500) | NULL                         | URL de l'image de la map                        |

**Relations :**

- Une map peut être utilisée dans plusieurs scrims (via `SCRIMS.mapId`)
- Une map peut être jouée dans plusieurs matchs (via `MATCHES`)

**Index :**

- PRIMARY KEY (`id`)
- UNIQUE (`title`)

---

## Table SCRIMS

**Description :** Stocke les informations des scrims (matchs d'entraînement) programmés entre deux équipes.

| Attribut     | Type        | Contraintes                  | Description                            |
| ------------ | ----------- | ---------------------------- | -------------------------------------- |
| `id`         | INTEGER     | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique du scrim            |
| `teamA`      | INTEGER     | FK → TEAMS.id, NOT NULL      | Identifiant de l'équipe A              |
| `teamB`      | INTEGER     | FK → TEAMS.id, NOT NULL      | Identifiant de l'équipe B              |
| `mapId`      | INTEGER     | FK → MAPS.id, NOT NULL       | Identifiant de la map à jouer          |
| `horaire`    | VARCHAR(10) | NULL                         | Heure du scrim au format HH:MM         |
| `created_at` | TIMESTAMP   | NOT NULL, DEFAULT NOW()      | Date et heure de création de l'annonce |
| `updated_at` | TIMESTAMP   | NOT NULL, DEFAULT NOW()      | Date et heure de dernière mise à jour  |

**Relations :**

- Un scrim oppose deux équipes (via `teamA` et `teamB` → `TEAMS.id`)
- Un scrim se joue sur une map (via `mapId` → `MAPS.id`)

**Contraintes :**

- `teamA` et `teamB` doivent être différents

**Index :**

- PRIMARY KEY (`id`)
- FOREIGN KEY (`teamA`) REFERENCES `TEAMS(id)` ON DELETE CASCADE
- FOREIGN KEY (`teamB`) REFERENCES `TEAMS(id)` ON DELETE CASCADE
- FOREIGN KEY (`mapId`) REFERENCES `MAPS(id)`
- INDEX (`teamA`)
- INDEX (`teamB`)
- INDEX (`mapId`)

---

## Table MATCHES

**Description :** Stocke l'historique des matchs joués entre deux équipes.

| Attribut | Type         | Contraintes                  | Description                  |
| -------- | ------------ | ---------------------------- | ---------------------------- |
| `id`     | VARCHAR(36)  | PK, NOT NULL                 | Identifiant unique du match  |
| `teamA`  | VARCHAR(100) | NOT NULL                     | Nom de l'équipe A            |
| `teamB`  | VARCHAR(100) | NOT NULL                     | Nom de l'équipe B            |
| `scoreA` | INTEGER      | NOT NULL, DEFAULT 0          | Score final de l'équipe A    |
| `scoreB` | INTEGER      | NOT NULL, DEFAULT 0          | Score final de l'équipe B    |

**Relations :**

- Un match oppose deux équipes identifiées par leur nom

**Contraintes :**

- `teamA` et `teamB` doivent être différents
- `scoreA` et `scoreB` doivent être >= 0

**Index :**

- PRIMARY KEY (`id`)
- INDEX (`teamA`)
- INDEX (`teamB`)

---

## Données FACEIT (API externe - non stockées)

> **⚠️ IMPORTANT : Ces données ne sont PAS stockées en base de données.**
>
> Les statistiques FACEIT sont récupérées en temps réel via l'API FACEIT Data v4 externe. Cette approche garantit :
> - Des données toujours à jour
> - Aucune synchronisation nécessaire
> - Aucun stockage de données tierces

**Données récupérées dynamiquement :**

| Attribut            | Type    | Description                                               |
| ------------------- | ------- | --------------------------------------------------------- |
| `elo`               | INTEGER | ELO FACEIT actuel du joueur                               |
| `matches_played`    | INTEGER | Nombre total de matchs joués                              |
| `wins`              | INTEGER | Nombre de victoires                                       |
| `win_rate`          | STRING  | Taux de victoire en pourcentage (ex: "33.33%")            |
| `winstreak`         | INTEGER | Série de victoires/défaites actuelle                      |
| `recent_matches`    | ARRAY   | 5 derniers matchs avec détails (map, score, résultat)     |
| `average_headshots` | STRING  | Taux de headshots moyen (ex: "65.2%")                     |
| `average_K_D`       | STRING  | Ratio K/D moyen (ex: "0.9", "1.3")                        |
| `fav_map`           | STRING  | Map favorite du joueur (calculée automatiquement)         |
| `fav_map_win_rate`  | STRING  | Taux de victoire sur la map favorite                      |
| `last_update`       | STRING  | Timestamp de la récupération (ISO 8601)                   |

**Liaison avec USERS :**

Le champ `faceit_id` de la table USERS permet de faire le lien avec l'API FACEIT. Ce champ peut contenir :
- Le **nickname FACEIT** du joueur (ex: "Musashiii_")
- L'**UUID FACEIT** du joueur (ex: "abc123-def456-...")

**Endpoints API FACEIT utilisés :**

- `GET /players/:nickname` - Recherche de joueur par nickname
- `GET /players/:playerId/stats/cs2` - Statistiques du joueur
- `GET /players/:playerId/history?game=cs2&limit=5` - 5 derniers matchs

---

## Table NOTIFICATIONS

**Description :** Stocke les notifications affichées aux utilisateurs.

| Attribut    | Type         | Contraintes      | Description                                                     |
| ----------- | ------------ | ---------------- | --------------------------------------------------------------- |
| `id`        | VARCHAR(36)  | PK, NOT NULL     | Identifiant unique de la notification                           |
| `type`      | VARCHAR(50)  | NOT NULL         | Type de notification : "new_member", "member_quit", "new_scrim" |
| `title`     | VARCHAR(200) | NOT NULL         | Titre de la notification                                        |
| `subtitle`  | VARCHAR(200) | NULL             | Sous-titre ou description supplémentaire (ex: nom du joueur)    |
| `timestamp` | VARCHAR(50)  | NULL             | Timestamp relatif (ex: "il y a 5 minutes", "il y a 1 heure")    |

**Contraintes :**

- `type` doit être l'une des valeurs : "new_member", "member_quit", "new_scrim"

**Index :**

- PRIMARY KEY (`id`)
- INDEX (`type`)

---

## Table SCRIM_ANNOUNCEMENTS

**Description :** Stocke les annonces de recherche de scrims créées par les équipes.

| Attribut    | Type         | Contraintes  | Description                                        |
| ----------- | ------------ | ------------ | -------------------------------------------------- |
| `id`        | VARCHAR(36)  | PK, NOT NULL | Identifiant unique de l'annonce                    |
| `teamName`  | VARCHAR(100) | NOT NULL     | Nom de l'équipe qui crée l'annonce                 |
| `timestamp` | VARCHAR(50)  | NULL         | Timestamp relatif (ex: "il y a 1 heure", "30 min") |

**Index :**

- PRIMARY KEY (`id`)
- INDEX (`teamName`)

---

## Résumé des Relations

### Relations 1-N (Un à Plusieurs)

1. **USERS → TEAM_MEMBERS** : Un utilisateur peut être membre d'une seule équipe
2. **USERS → NOTIFICATIONS** : Un utilisateur peut recevoir plusieurs notifications
3. **TEAMS → TEAM_MEMBERS** : Une équipe peut avoir plusieurs membres
4. **TEAMS → SCRIMS** : Une équipe peut créer/participer à plusieurs scrims (en tant qu'équipe A ou B)
5. **TEAMS → MATCHES** : Une équipe peut jouer plusieurs matchs (en tant qu'équipe A ou B)
6. **TEAMS → SCRIM_ANNOUNCEMENTS** : Une équipe peut créer plusieurs annonces
7. **MAPS → SCRIMS** : Une map peut être utilisée dans plusieurs scrims
8. **MAPS → MATCHES** : Une map peut être jouée dans plusieurs matchs

### Données externes (non stockées)

- **USERS.faceit_id → API FACEIT** : Le `faceit_id` permet de récupérer les statistiques FACEIT en temps réel via l'API externe. Ces données ne sont jamais persistées en base.
