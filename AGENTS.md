# Contexte projet

## Règles CI/CD
- Tout commit doit passer les tests Jest avant merge
- Le Dockerfile doit être multi-stage avec un user non-root
- Les déploiements passent par Octopus Deploy (Dev -> Staging -> Prod)
- Les releases suivent le semver (vX.Y.Z)

## Règles de revue
- Bloquer si secret, mot de passe ou token dans le diff
- Bloquer si un port ou un service est exposé sans justification
- Bloquer si un changement backend n'a aucun test alors qu'il devrait en avoir

## Contexte technique
- Application Node.js
- Déploiement Docker
- Déploiement via Octopus
