# Rendu cours docker TP2

## (il faut savoir que j'ai complètement oublié de remplir ces rendu pendant les tp donc je risque d'envoyer des gros bout de code complet notemment pour les dockerfile et compose.yml)

## TP2 Part 1 : Package your little thingie



---

## 2. Marche à suivre¶ (cela fait toute la partie 1 et toute la partie 2 du tp du coup... déso)
🌞 Le but est donc de packager votre app avec Docker :

Ecrire un Dockerfile pour avoir une image qui contient tes dépendances
Ecrire un compose.yml qui lance ton app + sa db

resultat : 

-compose.yml

```yml
services:

  db:
    image: postgres:16
    container_name: backproject_db
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    ports:
      - "${DB_PORT}:${DB_PORT}"
    volumes:
      - db_data:/var/lib/postgresql/data

  game_app:
    image: game_app:1.0
    container_name: game_app
    ports: 
      - ${APP_PORT}:${APP_PORT}
    env_file: .env
    depends_on:
      - db
      - mongo
    volumes:
      - ./src:/app/src

  mongo:
    image: mongo:7
    container_name: backproject_mongo
    ports:
      - "${MONGO_PORT}:${MONGO_PORT}"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    volumes:
      - mongo_data:/data/db

volumes:
  db_data:
  mongo_data:

```

-Dockerfile :

```yml
FROM node

RUN mkdir /app && mkdir /app/src

# On définit /app comme le "WORKDIR"
# A partir de cette ligne, toutes les commandes sont relatives au dossier /app
WORKDIR /app

# Copie du fichier package.json (de votre machine) dans le dossier "."
# "." fait référence au dossier actuel, qui est notre WORKDIR (donc c'est /app)
COPY ./package.json .

# Installation des dépendances
# Grâce à notre WORKDIR, cette commande est effectuée depuis le dossier /app de l'image
RUN npm install

# On copie le reste du code dans l'image
COPY ./src ./src

# On définit la commande à lancer lorsque le conteneur démarre
# Notez la syntaxe reloue (mais très secure) : sous forme de liste, pas d'espace
CMD [ "node", "./src/server.js"]
```

## TP2 Part 3 : Une attention à l'image de base


🌞 Ecrire un script qui tabasse : 
- le script est dispo dans le dossier bombard à la racine du projet






