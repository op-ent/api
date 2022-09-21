# op-ent API

Il s'agit de l'API pour le projet op-ent. Il s'agit d'une API REST et GraphQL qui est utilisée pour communiquer avec la base de données op-ent.

## Technologies

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [AdonisJS](https://adonisjs.com/)
- [GraphQL](https://graphql.org/)
- [Apollo](https://www.apollographql.com/)
- [Socket.IO](https://socket.io/)

## Développer

### Prérequis

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Yarn v1](https://classic.yarnpkg.com/en/docs/install)

### Installation & configuration

Exécuter `yarn` pour installer les dépendances.

Il n'y a pas besoin de toucher les fichiers d'environnements `.env.*`, `.env.local` est déjà configuré pour le développement.

### Lancement

Il faut exécuter 2 commandes en parallèle :

- `yarn docker:dev` : lance les bases de données et interfaces d'administration
- `yarn dev` : lance l'API

Vous avez accès à 2 consoles d'administration :

#### pgAdmin

Permet de gérer la base de données PostgreSQL.

- URL : http://localhost:5050.
- Identifiants :
  - Email : `admin@admin.com`
  - Mot de passe : `password`
  - Mot de passe de la base de données : `lucid`

#### RedisInsight

Permet de gérer la base de données Redis.

- URL : http://localhost:8001
- Identifiants :
  - Host : `redis-server`
  - Port : `6379`
  - Name : `redis`

## Licence

Publié sous la [licence GNU GPL v3](./LICENSE).

---

Fait avec ❤️ par [Florian LEFEBVRE](https://github.com/florian-lefebvre) en France.
