# Dictionnaire des Données - Find-It

**Version :** 1.0.0  
**Date :** 30 novembre 2025

Ce document décrit en détail toutes les entités, attributs et relations de la base de données Find-It.

---

## Table USERS

**Description :** Stocke les informations des utilisateurs (joueurs) de la plateforme.

| Attribut           | Type         | Contraintes                  | Description                           |
| ------------------ | ------------ | ---------------------------- | ------------------------------------- |
| `id`               | INTEGER      | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique de l'utilisateur   |
| `username`         | VARCHAR(100) | NOT NULL, UNIQUE             | Nom d'utilisateur unique              |
| `email`            | VARCHAR(255) | NOT NULL, UNIQUE             | Adresse email unique                  |
| `password_hash`    | VARCHAR(255) | NOT NULL                     | Hash du mot de passe (bcrypt)         |
| `avatar_url`       | VARCHAR(500) | NULL                         | URL de l'avatar du joueur             |
| `faceit_id`        | VARCHAR(50)  | NULL                         | Identifiant FACEIT du joueur          |
| `faceit_level`     | VARCHAR(10)  | NULL                         | Niveau FACEIT (1-10)                  |
| `steam_url`        | VARCHAR(500) | NULL                         | URL du profil Steam                   |
| `discord_username` | VARCHAR(100) | NULL                         | Nom d'utilisateur Discord             |
| `region`           | VARCHAR(50)  | NULL                         | Région géographique du joueur         |
| `created_at`       | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Date et heure de création du compte   |
| `updated_at`       | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Date et heure de dernière mise à jour |

**Relations :**

- Un utilisateur peut être membre d'une seule équipe (via `TEAM_MEMBERS`)
- Un utilisateur a une seule statistique FACEIT (via `FACEIT_STATS`)
- Un utilisateur peut recevoir plusieurs notifications (via `NOTIFICATIONS`)
- Un utilisateur peut être capitaine d'une équipe (via `TEAMS.captain_id`)

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

**Description :** Table de liaison entre les utilisateurs et les équipes. Stocke les informations d'appartenance d'un joueur à une équipe.

| Attribut    | Type        | Contraintes                  | Description                                                 |
| ----------- | ----------- | ---------------------------- | ----------------------------------------------------------- |
| `id`        | INTEGER     | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique de l'appartenance                        |
| `team_id`   | INTEGER     | FK → TEAMS.id, NOT NULL      | Identifiant de l'équipe                                     |
| `user_id`   | INTEGER     | FK → USERS.id, NOT NULL      | Identifiant de l'utilisateur                                |
| `joined_at` | TIMESTAMP   | NOT NULL, DEFAULT NOW()      | Date et heure d'adhésion à l'équipe                         |
| `role`      | VARCHAR(50) | NULL                         | Rôle du joueur dans l'équipe (ex: "Rifler", "AWPer", "IGL") |
| `is_leader` | BOOLEAN     | NOT NULL, DEFAULT FALSE      | Indique si le joueur est le leader de l'équipe              |

**Relations :**

- Un membre appartient à une équipe (via `team_id` → `TEAMS.id`)
- Un membre est un utilisateur (via `user_id` → `USERS.id`)

**Contraintes :**

- Un utilisateur ne peut pas être membre de la même équipe plusieurs fois (UNIQUE `team_id`, `user_id`)

**Index :**

- PRIMARY KEY (`id`)
- FOREIGN KEY (`team_id`) REFERENCES `TEAMS(id)` ON DELETE CASCADE
- FOREIGN KEY (`user_id`) REFERENCES `USERS(id)` ON DELETE CASCADE
- UNIQUE (`user_id`)
- INDEX (`team_id`)
- INDEX (`user_id`)

---

## Table MAPS

**Description :** Stocke les informations des maps de Counter-Strike disponibles pour les scrims et matchs.

| Attribut    | Type         | Contraintes                  | Description                                     |
| ----------- | ------------ | ---------------------------- | ----------------------------------------------- |
| `id`        | INTEGER      | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique de la map                    |
| `name`      | VARCHAR(100) | NOT NULL, UNIQUE             | Nom de la map (ex: "Mirage", "Nuke", "Inferno") |
| `image_url` | VARCHAR(500) | NULL                         | URL de l'image de la map                        |

**Relations :**

- Une map peut être utilisée dans plusieurs scrims (via `SCRIMS`)
- Une map peut être jouée dans plusieurs matchs (via `MATCHES`)

**Index :**

- PRIMARY KEY (`id`)
- UNIQUE (`name`)

---

## Table SCRIMS

**Description :** Stocke les informations des scrims (matchs d'entraînement) programmés entre deux équipes.

| Attribut     | Type        | Contraintes                  | Description                            |
| ------------ | ----------- | ---------------------------- | -------------------------------------- |
| `id`         | INTEGER     | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique du scrim            |
| `team_a_id`  | INTEGER     | FK → TEAMS.id, NOT NULL      | Identifiant de l'équipe A              |
| `team_b_id`  | INTEGER     | FK → TEAMS.id, NOT NULL      | Identifiant de l'équipe B              |
| `map_id`     | INTEGER     | FK → MAPS.id, NOT NULL       | Identifiant de la map à jouer          |
| `elo_min`    | INTEGER     | NULL                         | ELO minimum requis pour participer     |
| `elo_max`    | INTEGER     | NULL                         | ELO maximum requis pour participer     |
| `date`       | TIMESTAMP   | NOT NULL                     | Date et heure prévues du scrim         |
| `horaire`    | VARCHAR(10) | NULL                         | Heure du scrim au format HH:MM         |
| `created_at` | TIMESTAMP   | NOT NULL, DEFAULT NOW()      | Date et heure de création de l'annonce |
| `updated_at` | TIMESTAMP   | NOT NULL, DEFAULT NOW()      | Date et heure de dernière mise à jour  |

**Relations :**

- Un scrim oppose deux équipes (via `team_a_id` et `team_b_id` → `TEAMS.id`)
- Un scrim se joue sur une map (via `map_id` → `MAPS.id`)

**Contraintes :**

- `team_a_id` et `team_b_id` doivent être différents
- `elo_min` doit être inférieur ou égal à `elo_max` si les deux sont définis

**Index :**

- PRIMARY KEY (`id`)
- FOREIGN KEY (`team_a_id`) REFERENCES `TEAMS(id)` ON DELETE CASCADE
- FOREIGN KEY (`team_b_id`) REFERENCES `TEAMS(id)` ON DELETE CASCADE
- FOREIGN KEY (`map_id`) REFERENCES `MAPS(id)`
- INDEX (`team_a_id`)
- INDEX (`team_b_id`)
- INDEX (`date`)
- INDEX (`map_id`)

---

## Table MATCHES

**Description :** Stocke l'historique des matchs joués entre deux équipes.

| Attribut     | Type      | Contraintes                  | Description                                   |
| ------------ | --------- | ---------------------------- | --------------------------------------------- |
| `id`         | INTEGER   | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique du match                   |
| `team_a_id`  | INTEGER   | FK → TEAMS.id, NOT NULL      | Identifiant de l'équipe A                     |
| `team_b_id`  | INTEGER   | FK → TEAMS.id, NOT NULL      | Identifiant de l'équipe B                     |
| `score_a`    | INTEGER   | NOT NULL, DEFAULT 0          | Score final de l'équipe A                     |
| `score_b`    | INTEGER   | NOT NULL, DEFAULT 0          | Score final de l'équipe B                     |
| `map_id`     | INTEGER   | FK → MAPS.id, NULL           | Identifiant de la map jouée                   |
| `played_at`  | TIMESTAMP | NULL                         | Date et heure à laquelle le match a été joué  |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW()      | Date et heure de création de l'enregistrement |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW()      | Date et heure de dernière mise à jour         |

**Relations :**

- Un match oppose deux équipes (via `team_a_id` et `team_b_id` → `TEAMS.id`)
- Un match peut être joué sur une map (via `map_id` → `MAPS.id`)

**Contraintes :**

- `team_a_id` et `team_b_id` doivent être différents
- `score_a` et `score_b` doivent être >= 0

**Index :**

- PRIMARY KEY (`id`)
- FOREIGN KEY (`team_a_id`) REFERENCES `TEAMS(id)`
- FOREIGN KEY (`team_b_id`) REFERENCES `TEAMS(id)`
- FOREIGN KEY (`map_id`) REFERENCES `MAPS(id)`
- INDEX (`team_a_id`)
- INDEX (`team_b_id`)
- INDEX (`played_at`)
- INDEX (`map_id`)

---

## Table FACEIT_STATS

**Description :** Stocke les statistiques FACEIT des joueurs.

| Attribut            | Type         | Contraintes                     | Description                                                           |
| ------------------- | ------------ | ------------------------------- | --------------------------------------------------------------------- |
| `id`                | INTEGER      | PK, NOT NULL, AUTO_INCREMENT    | Identifiant unique                                                    |
| `user_id`           | INTEGER      | FK → USERS.id, NOT NULL, UNIQUE | Identifiant de l'utilisateur (un seul enregistrement par utilisateur) |
| `elo`               | INTEGER      | NOT NULL                        | ELO FACEIT actuel du joueur                                           |
| `matches_played`    | INTEGER      | NOT NULL, DEFAULT 0             | Nombre total de matchs joués                                          |
| `wins`              | INTEGER      | NOT NULL, DEFAULT 0             | Nombre de victoires                                                   |
| `win_rate`          | DECIMAL(5,2) | NULL                            | Taux de victoire en pourcentage (ex: 33.33)                           |
| `winstreak`         | INTEGER      | NOT NULL, DEFAULT 0             | Série de victoires actuelle                                           |
| `recent_matches`    | VARCHAR(50)  | NULL                            | Résultats des matchs récents (format: "W L W W L")                    |
| `average_headshots` | DECIMAL(5,2) | NULL                            | Taux de headshots moyen en pourcentage (ex: 65.20)                    |
| `average_K_D`       | DECIMAL(3,1) | NULL                            | Ratio K/D moyen (ex: 0.9, 1.3)                                        |
| `fav_map`           | VARCHAR(100) | NULL                            | Map favorite du joueur                                                |
| `fav_map_win_rate`  | DECIMAL(5,2) | NULL                            | Taux de victoire sur la map favorite en pourcentage                   |
| `fav_side`          | VARCHAR(10)  | NULL                            | Côté favori : "CT" (Counter-Terrorist) ou "T" (Terrorist)             |
| `last_update`       | TIMESTAMP    | NOT NULL, DEFAULT NOW()         | Date et heure de dernière mise à jour des statistiques                |

**Relations :**

- Les statistiques appartiennent à un utilisateur (via `user_id` → `USERS.id`)

**Contraintes :**

- Un utilisateur ne peut avoir qu'un seul enregistrement de statistiques (UNIQUE `user_id`)
- `matches_played` >= `wins`
- `win_rate` doit être entre 0 et 100 si défini
- `average_headshots` doit être entre 0 et 100 si défini
- `fav_map_win_rate` doit être entre 0 et 100 si défini

**Index :**

- PRIMARY KEY (`id`)
- FOREIGN KEY (`user_id`) REFERENCES `USERS(id)` ON DELETE CASCADE
- UNIQUE (`user_id`)
- INDEX (`elo`)

---

## Table NOTIFICATIONS

**Description :** Stocke les notifications envoyées aux utilisateurs.

| Attribut           | Type         | Contraintes                  | Description                                                     |
| ------------------ | ------------ | ---------------------------- | --------------------------------------------------------------- |
| `id`               | INTEGER      | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique de la notification                           |
| `user_id`          | INTEGER      | FK → USERS.id, NOT NULL      | Identifiant de l'utilisateur destinataire                       |
| `type`             | VARCHAR(50)  | NOT NULL                     | Type de notification : "new_member", "member_quit", "new_scrim" |
| `title`            | VARCHAR(200) | NOT NULL                     | Titre de la notification                                        |
| `subtitle`         | VARCHAR(200) | NULL                         | Sous-titre ou description supplémentaire                        |
| `related_team_id`  | INTEGER      | FK → TEAMS.id, NULL          | Identifiant de l'équipe concernée (si applicable)               |
| `related_user_id`  | INTEGER      | FK → USERS.id, NULL          | Identifiant de l'utilisateur concerné (si applicable)           |
| `related_scrim_id` | INTEGER      | FK → SCRIMS.id, NULL         | Identifiant du scrim concerné (si applicable)                   |
| `created_at`       | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Date et heure de création de la notification                    |

**Relations :**

- Une notification est destinée à un utilisateur (via `user_id` → `USERS.id`)
- Une notification peut être liée à une équipe (via `related_team_id` → `TEAMS.id`)
- Une notification peut être liée à un utilisateur (via `related_user_id` → `USERS.id`)
- Une notification peut être liée à un scrim (via `related_scrim_id` → `SCRIMS.id`)

**Contraintes :**

- `type` doit être l'une des valeurs : "new_member", "member_quit", "new_scrim"
- `read_at` doit être NULL si `is_read` est FALSE

**Index :**

- PRIMARY KEY (`id`)
- FOREIGN KEY (`user_id`) REFERENCES `USERS(id)` ON DELETE CASCADE
- FOREIGN KEY (`related_team_id`) REFERENCES `TEAMS(id)` ON DELETE SET NULL
- FOREIGN KEY (`related_user_id`) REFERENCES `USERS(id)` ON DELETE SET NULL
- FOREIGN KEY (`related_scrim_id`) REFERENCES `SCRIMS(id)` ON DELETE SET NULL
- INDEX (`user_id`)
- INDEX (`is_read`)
- INDEX (`created_at`)
- INDEX (`type`)

---

## Table SCRIM_ANNOUNCEMENTS

**Description :** Stocke les annonces de recherche de scrims créées par les équipes.

| Attribut     | Type         | Contraintes                  | Description                                        |
| ------------ | ------------ | ---------------------------- | -------------------------------------------------- |
| `id`         | INTEGER      | PK, NOT NULL, AUTO_INCREMENT | Identifiant unique de l'annonce                    |
| `team_id`    | INTEGER      | FK → TEAMS.id, NOT NULL      | Identifiant de l'équipe qui crée l'annonce         |
| `team_name`  | VARCHAR(100) | NULL                         | Nom de l'équipe (peut être dérivé de `team_id`)    |
| `timestamp`  | VARCHAR(50)  | NULL                         | Timestamp relatif (ex: "il y a 1 heure", "30 min") |
| `created_at` | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Date et heure de création de l'annonce             |

**Relations :**

- Une annonce est créée par une équipe (via `team_id` → `TEAMS.id`)

**Index :**

- PRIMARY KEY (`id`)
- FOREIGN KEY (`team_id`) REFERENCES `TEAMS(id)` ON DELETE CASCADE
- INDEX (`team_id`)
- INDEX (`created_at`)

---

## Résumé des Relations

### Relations 1-N (Un à Plusieurs)

1. **USERS → TEAM_MEMBERS** : Un utilisateur peut être membre d'une seule équipe
2. **USERS → FACEIT_STATS** : Un utilisateur a une seule statistique FACEIT (1-1)
3. **USERS → NOTIFICATIONS** : Un utilisateur peut recevoir plusieurs notifications
4. **TEAMS → TEAM_MEMBERS** : Une équipe peut avoir plusieurs membres
5. **TEAMS → SCRIMS** : Une équipe peut créer/participer à plusieurs scrims (en tant qu'équipe A ou B)
6. **TEAMS → MATCHES** : Une équipe peut jouer plusieurs matchs (en tant qu'équipe A ou B)
7. **TEAMS → SCRIM_ANNOUNCEMENTS** : Une équipe peut créer plusieurs annonces
8. **MAPS → SCRIMS** : Une map peut être utilisée dans plusieurs scrims
9. **MAPS → MATCHES** : Une map peut être jouée dans plusieurs matchs
