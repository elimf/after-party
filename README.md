# After Party - Frontend

Interface React du jeu multijoueur **After Party**. Elle permet aux joueurs de créer/rejoindre des salons, discuter et jouer en temps réel aux différents modes de jeu via WebSocket.

Ce projet fait partie du monorepo `game/` avec [`api-after-party`](../api-after-party) qui lui sert de backend.

## 🎮 Modes de jeu

| Mode | Description |
|---|---|
| **Quiz Classique** | Questions à choix multiples avec système de points basé sur la rapidité de réponse. |
| **Blindtest** | Devine le titre ou l'artiste à partir d'un extrait audio 30s issu d'iTunes. Configurable par artistes prédéfinis, genre, pays ou thème. |
| **Petit Bac** | Jeu du Baccalauréat avec lettre aléatoire, validation automatique des réponses, détection de doublons et calcul des points côté serveur. |

## 🛠 Stack technique

| Outil | Usage |
|---|---|
| [React 18](https://reactjs.org/) | Framework UI (Create React App) |
| [React Router DOM v6](https://reactrouter.com/) | Routage (Login, Register, MainPage) |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [WebSocket natif](https://developer.mozilla.org/fr/docs/Web/API/WebSocket) | Communication temps réel avec le backend |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | Notifications |
| [Heroicons](https://heroicons.com/), [React Modal](https://reactcommunity.org/react-modal/) | Composants UI |
| [Axios](https://axios-http.com/) | Requêtes HTTP (authentification) |

## 📁 Architecture

```text
after-party/src/
├── App.js              # Routage + AuthProvider
├── hooks/
│   ├── useWebSocket.js # Cœur de la communication WS (état salon/jeu, envoi/réception)
│   ├── AuthContext.js  # Gestion authentification JWT
│   └── ProtectedRoute.js
├── screen/
│   ├── MainPage.js     # Point d'entrée principal (Header + Waiting/RoomManager)
│   ├── Login.js        # Authentification
│   ├── Register.js
│   └── NotFound.js
├── component/
│   ├── RoomManager.js  # Orchestration d'un salon (chat + jeu)
│   ├── Waiting.js      # Lobby avant de rejoindre un salon
│   ├── BlindtestSetup.js # Configuration du Blindtest (genre/pays/thème/artistes)
│   ├── Game/           # Composants spécifiques à chaque mode de jeu
│   ├── Main/           # Header, etc.
│   └── Chat.js
├── styles/             # Thème "AfterParty" (dégradés festifs)
└── utils/              # Fonctions utilitaires
```

## 🔌 Contrat WebSocket

La communication est entièrement centralisée dans [`src/hooks/useWebSocket.js`](src/hooks/useWebSocket.js). 

- **Authentification** : Envoi du `token` JWT à la connexion (`type: "start"`)
- **État synchronisé** : `currentRoom`, `users`, `rooms`, `quizStarted`, `bacResults`
- **Événements clés** : `question`, `answer`, `endQuiz`, `bacResults`, `room`, `rooms`, `users`, `system`, `reconnect`
- **Actions** : `createRoom`, `joinRoom`, `leaveRoom`, `startQuiz`, `answerQuiz`, `startBacGame`, `submitBacResponses`

Le frontend **ne doit pas** calculer de points. Toute la logique de scoring est gérée par le backend. Le contrat des types côté serveur est défini dans [`api-after-party/src/types/index.ts`](../api-after-party/src/types/index.ts) et doit être pris en compte avant tout changement impactant le WebSocket.

## 🚀 Démarrage rapide

### Prérequis

- Node.js >= 16
- Le backend [`api-after-party`](../api-after-party) doit être en cours d'exécution

### Installation

```bash
npm install
```

### Configuration

Créez un fichier `.env` à la racine :

```env
REACT_APP_API_WS_URL=ws://localhost:3000
REACT_APP_API_URL=http://localhost:3000
```

### Lancement

```bash
# Développement
npm start

# Build de production
npm run build

# Tests
npm test
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## 🧭 Règles de développement

- **Cohérence avec le contrat WS** : Avant de modifier un composant lié au jeu, vérifiez l'impact sur `useWebSocket.js` et les types backend.
- **Backend first** : Si un changement nécessite un nouvel événement/message WS, l'implémenter d'abord côté `api-after-party`.
- **Pas de logique métier** : Le frontend ne valide/calculte jamais les scores. Seul l'affichage est géré ici.
- **UX temps-réel** : Garder l'état local fluide et bien synchronisé avec les événements du serveur.
