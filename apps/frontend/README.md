# FindIT Frontend

Application React pour la gestion de scrims Counter-Strike.

## Structure

```
frontend/
├── src/
│   ├── components/     # Composants réutilisables
│   ├── pages/         # Pages de l'application
│   ├── assets/        # Images et icônes
│   ├── utils/         # Fonctions utilitaires
│   ├── main.jsx       # Point d'entrée
│   └── index.css      # Styles globaux
├── public/            # Fichiers statiques
├── index.html         # Template HTML
├── vite.config.js     # Configuration Vite
└── package.json       # Dépendances frontend
```

## Scripts

- `pnpm dev` - Démarrer le serveur de développement
- `pnpm build` - Build de production
- `pnpm preview` - Prévisualiser le build
- `pnpm lint` - Linter le code

## Configuration

Le frontend utilise Vite avec React. La configuration se trouve dans `vite.config.js`.

Pour les alias de chemins, utilisez `@/` pour pointer vers `src/`.
