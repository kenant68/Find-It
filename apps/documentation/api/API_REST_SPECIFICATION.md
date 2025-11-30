# Spécification API REST - Find-It

**Version :** 1.0.0  
**Date :** 30 novembre 2025  
**Base URL :** `http://localhost:3000` (development)

## Format des données

- **Format :** JSON
- **Encodage :** UTF-8
- **Content-Type :** `application/json`

## Codes HTTP

| Code | Statut                | Description                      |
| ---- | --------------------- | -------------------------------- |
| 200  | OK                    | Requête réussie                  |
| 201  | Created               | Ressource créée avec succès      |
| 204  | No Content            | Ressource supprimée avec succès  |
| 400  | Bad Request           | Données invalides ou malformées  |
| 404  | Not Found             | Ressource introuvable            |
| 409  | Conflict              | Conflit (ex: email déjà utilisé) |
| 500  | Internal Server Error | Erreur serveur interne           |

## Format d'erreur

```json
{
  "error": {
    "message": "Description de l'erreur",
    "code": "CODE_ERREUR"
  }
}
```

## Paramètres de requête

### Pagination

- `page` (number, optionnel) : Numéro de page (défaut: 1)
- `limit` (number, optionnel) : Nombre d'éléments par page (défaut: 20, max: 100)

### Recherche

- `q` (string, optionnel) : Terme de recherche

### Tri

- `sort` (string, optionnel) : Champ de tri
- `order` ('asc' | 'desc', optionnel) : Ordre de tri (défaut: 'desc')

## Routes API

### Users

| Méthode | Endpoint     | Description              | Body                | Réponse        | Codes              |
| ------- | ------------ | ------------------------ | ------------------- | -------------- | ------------------ |
| GET     | `/users`     | Liste des utilisateurs   | -                   | `PublicUser[]` | 200                |
| GET     | `/users/:id` | Détails d'un utilisateur | -                   | `PublicUser`   | 200, 404           |
| POST    | `/users`     | Créer un utilisateur     | `CreateUserRequest` | `PublicUser`   | 201, 400, 409      |
| PATCH   | `/users/:id` | Modifier un utilisateur  | `UpdateUserRequest` | `PublicUser`   | 200, 400, 404, 409 |
| DELETE  | `/users/:id` | Supprimer un utilisateur | -                   | -              | 204, 404           |

**Exemple de requête POST /users :**

```json
{
  "username": "Musashiii_",
  "email": "musashi@gmail.com",
  "password": "motdepasse123",
  "avatar_url": "https://example.com/avatar.jpg",
  "faceit_level": "7",
  "region": "Europe",
  "steam_url": "https://steamcommunity.com/profiles/76561199091182456/",
  "discord_username": "Musashiii_#1234"
}
```

**Exemple de réponse GET /users/:id :**

```json
{
  "id": 1,
  "username": "Musashiii_",
  "email": "musashi@gmail.com",
  "avatar_url": "https://example.com/avatar.jpg",
  "faceit_level": "7",
  "region": "Europe",
  "steam_url": "https://steamcommunity.com/profiles/76561199091182456/",
  "discord_username": "Musashiii_#1234",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

### Teams

| Méthode | Endpoint             | Description          | Body                | Réponse        | Codes         |
| ------- | -------------------- | -------------------- | ------------------- | -------------- | ------------- |
| GET     | `/teams`             | Liste des équipes    | -                   | `Team[]`       | 200           |
| GET     | `/teams/:id`         | Détails d'une équipe | -                   | `Team`         | 200, 404      |
| GET     | `/teams/:id/members` | Membres d'une équipe | -                   | `TeamMember[]` | 200, 404      |
| POST    | `/teams`             | Créer une équipe     | `CreateTeamRequest` | `Team`         | 201, 400      |
| PATCH   | `/teams/:id`         | Modifier une équipe  | `UpdateTeamRequest` | `Team`         | 200, 400, 404 |
| DELETE  | `/teams/:id`         | Supprimer une équipe | -                   | -              | 204, 404      |

**Exemple de requête POST /teams :**

```json
{
  "name": "team_XANTARES",
  "region": "Asie",
  "logo_url": "https://example.com/logo.png",
  "banner_url": "https://example.com/banner.png",
  "captain_id": 1,
  "elo_avg": 1500
}
```

**Exemple de réponse GET /teams :**

```json
[
  {
    "id": 1,
    "name": "team_XANTARES",
    "region": "Asie",
    "logo_url": "https://example.com/logo.png",
    "banner_url": "https://example.com/banner.png",
    "captain_id": 1,
    "elo_avg": 1500,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
]
```

### Team Members

| Méthode | Endpoint            | Description         | Body                      | Réponse        | Codes         |
| ------- | ------------------- | ------------------- | ------------------------- | -------------- | ------------- |
| GET     | `/team-members`     | Liste des membres   | -                         | `TeamMember[]` | 200           |
| GET     | `/team-members/:id` | Détails d'un membre | -                         | `TeamMember`   | 200, 404      |
| POST    | `/team-members`     | Ajouter un membre   | `CreateTeamMemberRequest` | `TeamMember`   | 201, 400      |
| PATCH   | `/team-members/:id` | Modifier un membre  | `UpdateTeamMemberRequest` | `TeamMember`   | 200, 400, 404 |
| DELETE  | `/team-members/:id` | Retirer un membre   | -                         | -              | 204, 404      |

**Exemple de requête POST /team-members :**

```json
{
  "team_id": 1,
  "user_id": 2,
  "role": "Rifler",
  "is_leader": false
}
```

### Maps

| Méthode | Endpoint    | Description       | Body               | Réponse | Codes         |
| ------- | ----------- | ----------------- | ------------------ | ------- | ------------- |
| GET     | `/maps`     | Liste des maps    | -                  | `Map[]` | 200           |
| GET     | `/maps/:id` | Détails d'une map | -                  | `Map`   | 200, 404      |
| POST    | `/maps`     | Créer une map     | `CreateMapRequest` | `Map`   | 201, 400      |
| PATCH   | `/maps/:id` | Modifier une map  | `UpdateMapRequest` | `Map`   | 200, 400, 404 |
| DELETE  | `/maps/:id` | Supprimer une map | -                  | -       | 204, 404      |

**Exemple de réponse GET /maps :**

```json
[
  {
    "id": 1,
    "name": "Mirage",
    "image_url": "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Mirage_%28Counter-Strike_2%29.jpg/375px-Mirage_%28Counter-Strike_2%29.jpg"
  },
  {
    "id": 2,
    "name": "Nuke",
    "image_url": "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Nuke_%28CSGO%29.png/375px-Nuke_%28CSGO%29.png"
  }
]
```

### Scrims

| Méthode | Endpoint            | Description         | Body                 | Réponse   | Codes         |
| ------- | ------------------- | ------------------- | -------------------- | --------- | ------------- |
| GET     | `/scrims`           | Liste des scrims    | -                    | `Scrim[]` | 200           |
| GET     | `/scrims/:id`       | Détails d'un scrim  | -                    | `Scrim`   | 200, 404      |
| GET     | `/teams/:id/scrims` | Scrims d'une équipe | -                    | `Scrim[]` | 200, 404      |
| POST    | `/scrims`           | Créer un scrim      | `CreateScrimRequest` | `Scrim`   | 201, 400      |
| PATCH   | `/scrims/:id`       | Modifier un scrim   | `UpdateScrimRequest` | `Scrim`   | 200, 400, 404 |
| DELETE  | `/scrims/:id`       | Supprimer un scrim  | -                    | -         | 204, 404      |

**Exemple de requête POST /scrims :**

```json
{
  "team_a_id": 1,
  "team_b_id": 2,
  "map_id": 1,
  "elo_min": 1200,
  "elo_max": 1800,
  "date": "2025-01-15T21:00:00.000Z",
  "horaire": "21:00"
}
```

**Exemple de réponse GET /scrims :**

```json
[
  {
    "id": 1,
    "team_a_id": 1,
    "team_b_id": 2,
    "map_id": 1,
    "elo_min": null,
    "elo_max": null,
    "date": "2025-01-15T21:00:00.000Z",
    "horaire": "21:00",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
]
```

### Matches

| Méthode | Endpoint             | Description         | Body                 | Réponse   | Codes         |
| ------- | -------------------- | ------------------- | -------------------- | --------- | ------------- |
| GET     | `/matches`           | Liste des matchs    | -                    | `Match[]` | 200           |
| GET     | `/matches/:id`       | Détails d'un match  | -                    | `Match`   | 200, 404      |
| GET     | `/teams/:id/matches` | Matchs d'une équipe | -                    | `Match[]` | 200, 404      |
| POST    | `/matches`           | Créer un match      | `CreateMatchRequest` | `Match`   | 201, 400      |
| PATCH   | `/matches/:id`       | Modifier un match   | `UpdateMatchRequest` | `Match`   | 200, 400, 404 |
| DELETE  | `/matches/:id`       | Supprimer un match  | -                    | -         | 204, 404      |

**Exemple de requête POST /matches :**

```json
{
  "team_a_id": 1,
  "team_b_id": 2,
  "score_a": 13,
  "score_b": 11,
  "map_id": 1,
  "played_at": "2025-01-10T20:00:00.000Z"
}
```

**Exemple de réponse GET /matches :**

```json
[
  {
    "id": 1,
    "team_a_id": 1,
    "team_b_id": 2,
    "score_a": 13,
    "score_b": 11,
    "map_id": 1,
    "played_at": "2025-01-10T20:00:00.000Z",
    "created_at": "2025-01-10T20:00:00.000Z",
    "updated_at": "2025-01-10T20:00:00.000Z"
  }
]
```

### FACEIT Stats

| Méthode | Endpoint                  | Description            | Body                       | Réponse         | Codes         |
| ------- | ------------------------- | ---------------------- | -------------------------- | --------------- | ------------- |
| GET     | `/faceit-stats`           | Liste des stats        | -                          | `FaceitStats[]` | 200           |
| GET     | `/faceit-stats/:id`       | Détails des stats      | -                          | `FaceitStats`   | 200, 404      |
| GET     | `/users/:id/faceit-stats` | Stats d'un utilisateur | -                          | `FaceitStats`   | 200, 404      |
| POST    | `/faceit-stats`           | Créer des stats        | `CreateFaceitStatsRequest` | `FaceitStats`   | 201, 400      |
| PATCH   | `/faceit-stats/:id`       | Modifier des stats     | `UpdateFaceitStatsRequest` | `FaceitStats`   | 200, 400, 404 |
| DELETE  | `/faceit-stats/:id`       | Supprimer des stats    | -                          | -               | 204, 404      |

**Exemple de requête POST /faceit-stats :**

```json
{
  "user_id": 1,
  "elo": 1350,
  "matches_played": 150,
  "wins": 50,
  "win_rate": "33.33%",
  "winstreak": 0,
  "recent_matches": "W L W W L",
  "average_headshots": "65.2%",
  "average_K_D": "0.9",
  "fav_map": "Mirage",
  "fav_map_win_rate": "50%",
  "fav_side": "CT"
}
```

**Exemple de réponse GET /users/:id/faceit-stats :**

```json
{
  "id": 1,
  "user_id": 1,
  "elo": 1350,
  "matches_played": 150,
  "wins": 50,
  "win_rate": "33.33%",
  "winstreak": 0,
  "recent_matches": "W L W W L",
  "average_headshots": "65.2%",
  "average_K_D": "0.9",
  "fav_map": "Mirage",
  "fav_map_win_rate": "50%",
  "fav_side": "CT",
  "last_update": "2025-01-01T00:00:00.000Z"
}
```

### Notifications

| Méthode | Endpoint                   | Description                    | Body                        | Réponse          | Codes         |
| ------- | -------------------------- | ------------------------------ | --------------------------- | ---------------- | ------------- |
| GET     | `/notifications`           | Liste des notifications        | -                           | `Notification[]` | 200           |
| GET     | `/notifications/:id`       | Détails d'une notification     | -                           | `Notification`   | 200, 404      |
| GET     | `/users/:id/notifications` | Notifications d'un utilisateur | -                           | `Notification[]` | 200, 404      |
| POST    | `/notifications`           | Créer une notification         | `CreateNotificationRequest` | `Notification`   | 201, 400      |
| PATCH   | `/notifications/:id`       | Modifier une notification      | `UpdateNotificationRequest` | `Notification`   | 200, 400, 404 |
| PATCH   | `/notifications/:id/read`  | Marquer comme lue              | -                           | `Notification`   | 200, 404      |
| DELETE  | `/notifications/:id`       | Supprimer une notification     | -                           | -                | 204, 404      |

**Exemple de requête POST /notifications :**

```json
{
  "user_id": 1,
  "type": "new_member",
  "title": "Nouveau membre de l'équipe",
  "subtitle": "Musashiii_",
  "related_team_id": 9,
  "related_user_id": 1
}
```

**Exemple de réponse GET /users/:id/notifications :**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "type": "new_member",
    "title": "Nouveau membre de l'équipe",
    "subtitle": "Musashiii_",
    "related_team_id": 9,
    "related_user_id": 1,
    "related_scrim_id": null,
    "is_read": false,
    "created_at": "2025-01-15T10:00:00.000Z",
    "read_at": null
  }
]
```

### Scrim Announcements

| Méthode | Endpoint                         | Description           | Body                             | Réponse               | Codes    |
| ------- | -------------------------------- | --------------------- | -------------------------------- | --------------------- | -------- |
| GET     | `/scrim-announcements`           | Liste des annonces    | -                                | `ScrimAnnouncement[]` | 200      |
| GET     | `/scrim-announcements/:id`       | Détails d'une annonce | -                                | `ScrimAnnouncement`   | 200, 404 |
| GET     | `/teams/:id/scrim-announcements` | Annonces d'une équipe | -                                | `ScrimAnnouncement[]` | 200, 404 |
| POST    | `/scrim-announcements`           | Créer une annonce     | `CreateScrimAnnouncementRequest` | `ScrimAnnouncement`   | 201, 400 |
| DELETE  | `/scrim-announcements/:id`       | Supprimer une annonce | -                                | -                     | 204, 404 |

**Exemple de requête POST /scrim-announcements :**

```json
{
  "team_id": 1,
  "team_name": "team_APEX"
}
```

**Exemple de réponse GET /scrim-announcements :**

```json
[
  {
    "id": 1,
    "team_id": 1,
    "team_name": "team_APEX",
    "created_at": "2025-01-15T10:00:00.000Z"
  }
]
```

## Schémas de données

### User

```typescript
{
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  faceit_id?: string;
  faceit_level?: string;
  steam_url?: string;
  discord_username?: string;
  region?: string;
  created_at: string;
  updated_at: string;
}
```

### Team

```typescript
{
  id: number;
  name: string;
  logo_url?: string;
  banner_url?: string;
  captain_id?: number;
  elo_avg?: number;
  region?: string;
  created_at: string;
  updated_at: string;
}
```

### TeamMember

```typescript
{
  id: number;
  team_id: number;
  user_id: number;
  joined_at: string;
  role?: string;
  is_leader: boolean;
}
```

### Map

```typescript
{
  id: number;
  name: string;
  image_url?: string;
}
```

### Scrim

```typescript
{
  id: number;
  team_a_id: number;
  team_b_id: number;
  map_id: number;
  elo_min?: number;
  elo_max?: number;
  date: string;
  horaire?: string;
  created_at: string;
  updated_at: string;
}
```

### Match

```typescript
{
  id: number;
  team_a_id: number;
  team_b_id: number;
  score_a: number;
  score_b: number;
  map_id?: number;
  played_at?: string;
  created_at: string;
  updated_at: string;
}
```

### FaceitStats

```typescript
{
  id: number;
  user_id: number;
  elo: number;
  matches_played: number;
  wins: number;
  win_rate?: string;
  winstreak?: number;
  recent_matches?: string;        // Format "W L W W L"
  average_headshots?: string;
  average_K_D?: string;
  fav_map?: string;
  fav_map_win_rate?: string;
  fav_side?: string;              // "CT" ou "T"
  last_update: string;
}
```

### Notification

```typescript
{
  id: number;
  user_id: number;
  type: 'new_member' | 'member_quit' | 'new_scrim';
  title: string;
  subtitle?: string;
  related_team_id?: number;
  related_user_id?: number;
  related_scrim_id?: number;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}
```

### ScrimAnnouncement

```typescript
{
  id: number;
  team_id: number;
  team_name?: string;
  created_at: string;
}
```

## Notes d'implémentation

### Authentification

L'authentification n'est pas implémentée dans cette version. Elle sera ajoutée ultérieurement avec JWT.

### Performance

- Utiliser la pagination pour les listes importantes
- Indexer les champs fréquemment utilisés dans les requêtes (user_id, team_id, etc.)
- Mettre en cache les données statiques (maps, etc.)
