# Directives Agentiques — AfterParty Frontend

## 🎯 Périmètre
Tu travailles sur l'interface utilisateur d'AfterParty (écrans de jeux, chronomètres, animations, affichage des scores en temps réel).

## 🔄 Workflow de Développement
1. **Design & Composants :**
   - Crée des composants UI réutilisables et réactifs.
   - Respecte la charte graphique et la palette de couleurs "AfterParty" (ambiance festive/ludique).
2. **Gestion de l'État (State Management) :**
   - Assure-toi que l'état local du jeu (ex: chronomètre, sélection de réponse) reste fluide et bien synchronisé avec les événements reçus du backend.
3. **Validation :**
   - Lance le linter frontend (`npm run lint`) et vérifie qu'il n'y a aucune erreur de compilation TypeScript ou React/Vue.

## ⚠️ Interdictions
* ❌ N'ajoute pas de bibliothèques UI lourdes sans demander mon accord.
* ❌ Ne mets pas de logique métier de calcul de points dans le frontend (le backend reste la seule source de vérité).