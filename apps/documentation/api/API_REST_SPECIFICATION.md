# Spécification API REST - Find-It

**Version :** 2.0.0  
**Date :** 18 janvier 2026  
**Base URL :** `http://localhost:4000/api` (development)

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
| 401  | Unauthorized          | Authentification requise         |
| 403  | Forbidden             | Accès refusé                     |
| 404  | Not Found             | Ressource introuvable            |
| 409  | Conflict              | Conflit (ex: email déjà utilisé) |
| 500  | Internal Server Error | Erreur serveur interne           |

## Authentification

L'API utilise l'authentification JWT (JSON Web Token). Les endpoints protégés nécessitent un header `Authorization` :

```
Authorization: Bearer <token>
```

Le token est obtenu via l'endpoint `/auth/login`.

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

### Auth

| Méthode | Endpoint               | Description                          | Body                          | Réponse                  | Codes     |
| ------- | ---------------------- | ------------------------------------ | ----------------------------- | ------------------------ | --------- |
| POST    | `/auth/login`          | Connexion utilisateur                | `LoginRequest`                | `{ token, user }`        | 200, 401  |
| POST    | `/auth/forgot-password`| Demande de réinitialisation          | `{ email }`                   | `{ message }`            | 200, 404  |
| POST    | `/auth/reset-password` | Réinitialisation du mot de passe     | `{ token, password }`         | `{ message }`            | 200, 400  |

**Exemple de requête POST /auth/login :**

```json
{
  "email": "musashi@gmail.com",
  "password": "motdepasse123"
}
```

**Exemple de réponse POST /auth/login :**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "Musashiii_",
    "email": "musashi@gmail.com"
  }
}
```

### Users

| Méthode | Endpoint                   | Description                  | Body                | Réponse        | Codes              | Auth |
| ------- | -------------------------- | ---------------------------- | ------------------- | -------------- | ------------------ | ---- |
| GET     | `/users`                   | Liste des utilisateurs       | -                   | `PublicUser[]` | 200                | Non  |
| GET     | `/users/:id`               | Détails d'un utilisateur     | -                   | `PublicUser`   | 200, 404           | Non  |
| GET     | `/users/username/:username`| Recherche par username       | -                   | `PublicUser`   | 200, 404           | Oui  |
| GET     | `/users/email/:email`      | Recherche par email          | -                   | `PublicUser`   | 200, 404           | Oui  |
| POST    | `/users`                   | Créer un utilisateur         | `CreateUserRequest` | `PublicUser`   | 201, 400, 409      | Non  |
| PUT     | `/users/:id`               | Modifier un utilisateur      | `UpdateUserRequest` | `PublicUser`   | 200, 400, 404, 409 | Oui  |
| PUT     | `/users/:id/password`      | Modifier le mot de passe     | `{ password }`      | `PublicUser`   | 200, 400, 404      | Oui  |
| DELETE  | `/users/:id`               | Supprimer un utilisateur     | -                   | -              | 204, 404           | Oui  |
| POST    | `/users/avatar`            | Upload avatar                | `FormData (avatar)` | `{ url }`      | 200, 400           | Oui  |
| POST    | `/users/banner`            | Upload bannière              | `FormData (banner)` | `{ url }`      | 200, 400           | Oui  |
| DELETE  | `/users/avatar`            | Supprimer avatar             | -                   | -              | 204                | Oui  |
| DELETE  | `/users/banner`            | Supprimer bannière           | -                   | -              | 204                | Oui  |

**Exemple de requête POST /users :**

```json
{
  "username": "Musashiii_",
  "email": "musashi@gmail.com",
  "password": "motdepasse123",
  "avatar_url": "https://example.com/avatar.jpg",
  "faceit_id": "Musashiii_",
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
  "faceit_id": "Musashiii_",
  "faceit_level": "7",
  "region": "Europe",
  "steam_url": "https://steamcommunity.com/profiles/76561199091182456/",
  "discord_username": "Musashiii_#1234",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

### Teams

| Méthode | Endpoint                    | Description                    | Body                | Réponse              | Codes         | Auth |
| ------- | --------------------------- | ------------------------------ | ------------------- | -------------------- | ------------- | ---- |
| GET     | `/teams`                    | Liste des équipes              | -                   | `Team[]`             | 200           | Non  |
| GET     | `/teams/my-team`            | Mon équipe actuelle            | -                   | `TeamWithMembers`    | 200, 404      | Oui  |
| GET     | `/teams/name/:name`         | Recherche par nom              | -                   | `Team`               | 200, 404      | Non  |
| GET     | `/teams/:id`                | Détails d'une équipe           | -                   | `Team`               | 200, 404      | Non  |
| GET     | `/teams/:id/members`        | Équipe avec ses membres        | -                   | `TeamWithMembers`    | 200, 404      | Non  |
| GET     | `/teams/:id/scrims`         | Scrims d'une équipe            | -                   | `Scrim[]`            | 200, 404      | Non  |
| POST    | `/teams`                    | Créer une équipe               | `CreateTeamRequest` | `Team`               | 201, 400      | Oui  |
| POST    | `/teams/:id/claim`          | Revendiquer une équipe         | -                   | `Team`               | 200, 400, 409 | Oui  |
| POST    | `/teams/:id/join`           | Rejoindre une équipe           | -                   | `TeamMember`         | 200, 400, 409 | Oui  |
| POST    | `/teams/leave`              | Quitter son équipe             | -                   | -                    | 204, 400      | Oui  |
| PUT     | `/teams/:id`                | Modifier une équipe            | `UpdateTeamRequest` | `Team`               | 200, 400, 404 | Oui  |
| DELETE  | `/teams/:id`                | Supprimer une équipe           | -                   | -                    | 204, 404      | Oui  |
| POST    | `/teams/:id/members`        | Ajouter un membre              | `{ userId, role }`  | `TeamMember`         | 201, 400      | Oui  |
| DELETE  | `/teams/:id/members/:userId`| Retirer un membre              | -                   | -                    | 204, 404      | Oui  |

**Exemple de requête POST /teams :**

```json
{
  "name": "team_XANTARES",
  "region": "Asie",
  "logo_url": "https://example.com/logo.png",
  "banner_url": "https://example.com/banner.png"
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

**Exemple de réponse GET /teams/:id/members :**

```json
{
  "id": 1,
  "name": "team_XANTARES",
  "region": "Asie",
  "logo_url": "https://example.com/logo.png",
  "captain_id": 1,
  "members": [
    {
      "id": 1,
      "user_id": 1,
      "username": "Musashiii_",
      "avatar_url": "https://example.com/avatar.jpg",
      "faceit_level": "10",
      "role": "IGL",
      "is_leader": true,
      "joined_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Maps

| Méthode | Endpoint            | Description            | Body               | Réponse | Codes         |
| ------- | ------------------- | ---------------------- | ------------------ | ------- | ------------- |
| GET     | `/maps`             | Liste des maps         | -                  | `Map[]` | 200           |
| GET     | `/maps/:id`         | Détails d'une map      | -                  | `Map`   | 200, 404      |
| GET     | `/maps/title/:title`| Recherche par titre    | -                  | `Map`   | 200, 404      |
| POST    | `/maps`             | Créer une map          | `CreateMapRequest` | `Map`   | 201, 400      |
| PUT     | `/maps/:id`         | Modifier une map       | `UpdateMapRequest` | `Map`   | 200, 400, 404 |
| DELETE  | `/maps/:id`         | Supprimer une map      | -                  | -       | 204, 404      |

**Exemple de réponse GET /maps :**

```json
[
  {
    "id": 1,
    "title": "Mirage",
    "img": "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Mirage_%28Counter-Strike_2%29.jpg/375px-Mirage_%28Counter-Strike_2%29.jpg"
  },
  {
    "id": 2,
    "title": "Nuke",
    "img": "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Nuke_%28CSGO%29.png/375px-Nuke_%28CSGO%29.png"
  }
]
```

### Scrims

| Méthode | Endpoint                 | Description               | Body                 | Réponse   | Codes         |
| ------- | ------------------------ | ------------------------- | -------------------- | --------- | ------------- |
| GET     | `/scrims`                | Liste des scrims          | -                    | `Scrim[]` | 200           |
| GET     | `/scrims/:id`            | Détails d'un scrim        | -                    | `Scrim`   | 200, 404      |
| GET     | `/scrims/team/:teamId`   | Scrims d'une équipe       | -                    | `Scrim[]` | 200, 404      |
| GET     | `/scrims/status/:status` | Scrims par statut         | -                    | `Scrim[]` | 200           |
| POST    | `/scrims`                | Créer un scrim            | `CreateScrimRequest` | `Scrim`   | 201, 400      |
| PUT     | `/scrims/:id`            | Modifier un scrim         | `UpdateScrimRequest` | `Scrim`   | 200, 400, 404 |
| DELETE  | `/scrims/:id`            | Supprimer un scrim        | -                    | -         | 204, 404      |

**Exemple de requête POST /scrims :**

```json
{
  "teamA": 1,
  "teamB": 2,
  "mapId": 1,
  "horaire": "21:00"
}
```

**Exemple de réponse GET /scrims :**

```json
[
  {
    "id": 1,
    "teamA": 1,
    "teamB": 2,
    "mapId": 1,
    "horaire": "21:00",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
]
```

### Matches

| Méthode | Endpoint                  | Description              | Body                 | Réponse   | Codes         |
| ------- | ------------------------- | ------------------------ | -------------------- | --------- | ------------- |
| GET     | `/matches`                | Liste des matchs         | -                    | `Match[]` | 200           |
| GET     | `/matches/:id`            | Détails d'un match       | -                    | `Match`   | 200, 404      |
| GET     | `/matches/team/:teamName` | Matchs d'une équipe      | -                    | `Match[]` | 200, 404      |
| POST    | `/matches`                | Créer un match           | `CreateMatchRequest` | `Match`   | 201, 400      |

**Exemple de requête POST /matches :**

```json
{
  "teamA": "team_XANTARES",
  "teamB": "team_r0pz",
  "scoreA": 13,
  "scoreB": 11
}
```

**Exemple de réponse GET /matches :**

```json
[
  {
    "id": "1",
    "teamA": "team_XANTARES",
    "teamB": "team_r0pz",
    "scoreA": 13,
    "scoreB": 11
  }
]
```

### FACEIT Stats (Lecture seule - API externe)

> **Note importante :** Les statistiques FACEIT ne sont **pas stockées** en base de données. Elles sont récupérées en temps réel via l'API FACEIT externe à chaque requête.

| Méthode | Endpoint                  | Description                       | Réponse         | Codes              |
| ------- | ------------------------- | --------------------------------- | --------------- | ------------------ |
| GET     | `/faceit-stats`           | Liste des stats (cache)           | `FaceitStats[]` | 200                |
| GET     | `/faceit-stats/:id`       | Stats par ID FACEIT/Nickname      | `FaceitStats`   | 200, 404           |
| GET     | `/users/:id/faceit-stats` | Stats d'un utilisateur            | `FaceitStats`   | 200, 404           |

**Exemple de réponse GET /users/:id/faceit-stats :**

```json
{
  "user_id": 1,
  "elo": 1350,
  "matches_played": 150,
  "wins": 50,
  "win_rate": "33.33%",
  "winstreak": 0,
  "recent_matches": [...],
  "average_headshots": "65.2%",
  "average_K_D": "0.9",
  "fav_map": "Mirage",
  "fav_map_win_rate": "50%",
  "last_update": "2025-01-18T12:00:00.000Z"
}
```

### FACEIT Matches (Lecture seule - API externe)

> **Note importante :** Les matchs FACEIT sont récupérés en temps réel via l'API FACEIT externe. Ces données ne sont pas stockées localement.

| Méthode | Endpoint                            | Description                    | Réponse           | Codes    |
| ------- | ----------------------------------- | ------------------------------ | ----------------- | -------- |
| GET     | `/faceit-matches/:userId`           | Stats FACEIT d'un utilisateur  | `FaceitStats`     | 200, 404 |
| GET     | `/faceit-matches/:userId/recent-matches` | 5 derniers matchs FACEIT  | `FaceitMatch[]`   | 200, 404 |

**Exemple de réponse GET /faceit-matches/:userId/recent-matches :**

```json
[
  {
    "matchId": "1-abc123-def456",
    "playedAt": "2025-01-18T20:30:00.000Z",
    "map": "Mirage",
    "result": "win",
    "score": "13-10",
    "playerScore": 13,
    "opponentScore": 10,
    "playerTeam": {
      "name": "team_Musashiii_",
      "score": 13
    },
    "opponentTeam": {
      "name": "team_Enemy",
      "score": 10
    },
    "eloChange": "+25",
    "matchUrl": "https://www.faceit.com/en/cs2/room/1-abc123-def456"
  }
]
```

**Codes d'erreur FACEIT :**

| Code d'erreur               | Description                                    |
| --------------------------- | ---------------------------------------------- |
| `FACEIT_API_KEY_NOT_SET`    | Clé API FACEIT non configurée                  |
| `FACEIT_API_KEY_INVALID`    | Clé API FACEIT invalide                        |
| `FACEIT_PLAYER_NOT_FOUND`   | Joueur FACEIT non trouvé                       |
| `FACEIT_API_FORBIDDEN`      | Accès refusé par l'API FACEIT                  |
| `FACEIT_API_RATE_LIMIT`     | Limite de requêtes API FACEIT atteinte         |
| `FACEIT_API_UNAVAILABLE`    | API FACEIT indisponible                        |

### Notifications

> **Note :** Les notifications sont actuellement gérées via le fichier `db.json` pour le développement.

| Méthode | Endpoint           | Description                 | Réponse          | Codes    |
| ------- | ------------------ | --------------------------- | ---------------- | -------- |
| GET     | `/notifications`   | Liste des notifications     | `Notification[]` | 200      |

**Exemple de réponse GET /notifications :**

```json
[
  {
    "id": "1",
    "type": "new_member",
    "title": "Nouveau membre de l'équipe",
    "subtitle": "Musashiii_",
    "timestamp": "il y a 5 minutes"
  },
  {
    "id": "2",
    "type": "new_scrim",
    "title": "Nouveau scrim en approche",
    "subtitle": "team_w0xic",
    "timestamp": "il y a 1 heure"
  }
]
```

### Scrim Announcements

> **Note :** Les annonces de scrim sont actuellement gérées via le fichier `db.json` pour le développement.

| Méthode | Endpoint              | Description           | Réponse               | Codes    |
| ------- | --------------------- | --------------------- | --------------------- | -------- |
| GET     | `/scrimAnnouncements` | Liste des annonces    | `ScrimAnnouncement[]` | 200      |

**Exemple de réponse GET /scrimAnnouncements :**

```json
[
  {
    "id": "1",
    "teamName": "team_APEX",
    "timestamp": "30 min"
  },
  {
    "id": "2",
    "teamName": "team_donk666",
    "timestamp": "il y a 1 heure"
  }
]
```

## Schémas de données

### User

```typescript
{
  id: string;
  username: string;
  email: string;
  password: string;
  avatar_url?: string;
  banner_url?: string;
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
  id: string;
  username: string;
  avatar: string;
  faceitLevel: number;
  isLeader: boolean;
}
```

### TeamWithMembers

```typescript
{
  id: number;
  name: string;
  region?: string;
  logo_url?: string;
  captain_id?: number;
  members: TeamMember[];
}
```

### Map

```typescript
{
  id: number;
  title: string;
  img?: string;
}
```

### Scrim

```typescript
{
  id: number;
  teamA: number;
  teamB: number;
  mapId: number;
  horaire?: string;
  created_at: string;
  updated_at: string;
}
```

### Match

```typescript
{
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
}
```

### FaceitStats (données externes - non stockées)

> **Important :** Ces données proviennent de l'API FACEIT externe et ne sont pas stockées en base de données.

```typescript
{
  user_id?: string;
  elo: number;
  matches_played: number;
  wins: number;
  win_rate?: string;
  winstreak?: number;
  recent_matches?: FaceitMatch[];
  average_headshots?: string;
  average_K_D?: string;
  fav_map?: string;
  fav_map_win_rate?: string;
  last_update: string;
}
```

### FaceitMatch (données externes - non stockées)

```typescript
{
  matchId: string;
  playedAt: string;
  map?: string;
  result: 'win' | 'loss';
  score: string;
  playerScore: number;
  opponentScore: number;
  playerTeam: {
    name: string;
    score: number;
  };
  opponentTeam: {
    name: string;
    score: number;
  };
  eloChange?: string;
  matchUrl: string;
}
```

### Notification

```typescript
{
  id: string;
  type: 'new_member' | 'member_quit' | 'new_scrim';
  title: string;
  subtitle?: string;
  timestamp: string;
}
```

### ScrimAnnouncement

```typescript
{
  id: string;
  teamName: string;
  timestamp: string;
}
```

## Notes d'implémentation

### Authentification

L'API utilise JWT (JSON Web Token) pour l'authentification. Le token est retourné lors de la connexion via `/auth/login` et doit être inclus dans le header `Authorization` pour les endpoints protégés.

### Intégration FACEIT

Les statistiques FACEIT sont récupérées en temps réel via l'API FACEIT Data v4. Cette approche garantit des données toujours à jour sans nécessiter de synchronisation.

**Configuration requise :**
- Variable d'environnement `FACEIT_API_KEY` contenant une clé API FACEIT valide

**Endpoints FACEIT utilisés :**
- `/players/:nickname` - Recherche de joueur
- `/players/:playerId/stats/cs2` - Statistiques du joueur
- `/players/:playerId/history` - Historique des matchs

### Upload de fichiers

Les avatars et bannières utilisateurs sont uploadés via `FormData` et stockés dans le dossier `/uploads` du serveur.

### Performance

- Utiliser la pagination pour les listes importantes
- Les statistiques FACEIT sont récupérées à la demande (pas de cache persistant)
- Les données statiques (maps) peuvent être mises en cache côté client
