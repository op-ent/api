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

- Exécuter `yarn` pour installer les dépendances.
- Copier le fichier `.env.example` et le renommer en `.env.local`. Il n'y a pas besoin de modifier les variables d'environnement.

### Lancement

Il faut exécuter 2 commandes en parallèle :

- `yarn docker:dev` : lance les bases de données et interfaces d'administration. La 1ère fois, exécuter `yarn migrate` avant la commande suivante. Pensez à stocker quelque part les données qui apparaissent dans le terminal ! Cela vous évitera d'aller la chercher dans pgAdmin
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

### Persistance & reset

Toutes les données stockées dans les bases de données presistent d'une utilisation à l'autre. Pour les reset, il faut passer par Docker Desktop directement, supprimer les containers puis les volumes associés.

### Utilisation

Lors de la 1ère utilisation (`yarn migrate`), un utilisateur par défaut est créé, et avec lui un `access-id` et `access-token`. Pour toutes les requêtes à l'API, il est nécessaire de passer chacune de ces 2 données dans le header correspondant.

### Ace CLI

Adonis propose un CLI utilisable via `node ace`. Cependant, il faut utiliser `yarn ace` à la place en développement. Cela permet d'utiliser automatiquement les variables d'environnement du fichier `.env.local`.

### Notifications

Nous utilisons [Novu](https://novu.co). Pour le moment, il n'est pas possible d'envoyer des notifications en développement. Pour setup novu, il faut exécuter `yarn ace novu:setup` et suivre les instructions.

## Routes

```
├── auth
│   ├── login (POST)
│   └── register (POST)
├── developers
│   └── accesses (GET, POST)
│       └── :id (GET, PUT, DELETE)
```

## Licence

Publié sous la [licence GNU GPL v3](./LICENSE).

Fait avec ❤️ par [Florian LEFEBVRE](https://github.com/florian-lefebvre) en France.

---

<table>
  <thead>
    <tr>
      <th colspan="2">Sponsors</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <a href="https://www.netlify.com" target="_blank">
          <img alt="Netlify banner" height="51px" src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg" />
        </a>
      </td>
      <td>
        <a href="https://cleavr.io" target="_blank">
          <img alt="Cleavr banner" height="51px" src="https://hcti.io/v1/image/ae9a047f-22b3-4016-a37a-80f297894678" />
        </a>
      </td>
    </tr>
  </tbody>
</table>
