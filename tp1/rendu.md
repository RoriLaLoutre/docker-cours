# Rendu cours docker TP1

## TP1 Part 1 : Just run things ffs

---

## 1) Une ptite db MySQL

🌞 **Lancez un conteneur MySQL en version 8.4**

**Commande :**

```bash
docker run --name madb mysql:8.4
```

**Résultat :**

```bash
Status: Downloaded newer image for mysql:8.4
You need to specify one of the following as an environment variable:
  - MYSQL_ROOT_PASSWORD
  - MYSQL_ALLOW_EMPTY_PASSWORD
  - MYSQL_RANDOM_ROOT_PASSWORD
```

---

🌞 **Vérifier que le conteneur est actif**

**Commande :**

```bash
docker ps -a
```

**Résultat :**

```bash
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS                     PORTS     NAMES
d631a03fd335   mysql:8.4   "docker-entrypoint.s…"   6 minutes ago   Exited (1) 6 minutes ago             madb
```

---

🌞 **Consulter les logs du conteneur**

**Commande :**

```bash
docker logs madb
```

**Résultat :**

```bash
2025-12-15 10:07:30+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
2025-12-15 10:07:30+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
2025-12-15 10:07:30+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
2025-12-15 10:07:30+00:00 [ERROR] [Entrypoint]: Database is uninitialized and password option is not specified
You need to specify one of the following as an environment variable:
  - MYSQL_ROOT_PASSWORD
  - MYSQL_ALLOW_EMPTY_PASSWORD
  - MYSQL_RANDOM_ROOT_PASSWORD
```

---

🌞 **Supprimer le conteneur inactif**

**Commande :**

```bash
docker rm madb
```

**Résultat :**

```bash
madb
```

---

🌞 **Lancer un nouveau conteneur MySQL avec mot de passe**

**Commande :**

```bash
docker run --name madb -e MYSQL_ROOT_PASSWORD=123 mysql:8.4
```

**Résultat :**

```bash
Le conteneur MySQL est lancé correctement
```

---

## 2) Un PMA pour accompagner la DB

🌞 **Lancer un conteneur PHPMyAdmin**

**Commande :**

```bash
docker run --name phpmyadmin -d --link madb:db -p 8080:80 phpmyadmin
```

**Résultat :**

```bash
Téléchargement de l'image et démarrage du conteneur
```

---

🌞 **Visiter l'interface web de PHPMyAdmin**

**Commande :**

```bash
curl http://localhost:8080
```

**Résultat :**

```bash
<!doctype html>
<html lang="en" dir="ltr">
```

## 3) Compose

🌞 **Lancer la stack Docker Compose**

**Commande :**

```bash
docker compose up -d
```

**Résultat :**

```bash
✔ Network docker_default  Created   0.0s
✔ Container docker-db-1   Started   0.4s
✔ Container docker-pma-1  Started
```

## 4) Donnée persistantes

🌞 Prouver que le volume est bien utilisé

```bash 
docker volume ls
```

```bash
DRIVER    VOLUME NAME
local     7c4d7ce3ae700a8ef1a0212e7cb99aa21272257dde7e2d72e29e00626671e13a
local     110c7349535554b5b638388c43dc8ee73f00970b16ea4a34c404f5f40ef98b72
local     232f4a2bc4cf9493f04589b5971e194b7a9fb6da6a345f267a3a63532839ce61
local     a768bae98deaaad75ba55577b2314e8ce6c1804efc6d8d57457f1213186fe920
local     b242ae1c76708eacc4c3e90ebd019dc2035e9f48b14916d06f6d27647219b96b
local     bb0e27aa15bfe99b9cb440d78c0ba3a2305f8bf9d3eaf5823f914a29575232c9
local     docker_db_data
```

## 5) Changing database easily


🌞 Proposer un nouveau compose.yml


```yaml
services:
  db2:
    image: postgres
    environment:
      - POSTGRES_PASSWORD=123

  pma2:
    image: adminer
    ports:
      - 8080:8080
```

🌞 Prouver que ça run !

```bash
docker compose up -d
[+] Running 3/3
 ✔ Network docker_default   Created                                                                                                                    0.0s
 ✔ Container docker-pma2-1  Started                                                                                                                    0.5s
 ✔ Container docker-db2-1   Started      
```

🌞 Lancer l'application avec une commande docker run, cette commande :

## TP1 Part 2 : Dev environment¶

🌞 Construire l'image shitty_app à partir de ce Dockerfile :

- **Commande**
```bash
docker build -t shitty_app:1.0 .
```

- **Résultat**
```bash
[+] Building 35.4s (11/11) FINISHED                                    
...
 => [internal] load build context                                                                                                                      0.1s
 => => transferring context: 1.46kB                                                                                                                    0.0s
 => [2/6] RUN mkdir /app && mkdir /app/src                                                                                                             0.6s
 => [3/6] WORKDIR /app                                                                                                                                 0.1s
 => [4/6] COPY ./package.json .                                                                                                                        0.1s
 => [5/6] RUN npm install                                                                                                                              7.5s
 => [6/6] COPY ./src ./src                                        
 ...
 
 => => naming to docker.io/library/shitty_app:1.0                                                                                                      0.0s
 => => unpacking to docker.io/library/shitty_app:1.0
```

🌞 Lancer l'application avec une commande docker run, cette commande :


- **Commande**
```bash
docker run --name shitty-app -p 3000:3000 -d shitty_app:1.0
```
🌞 Prouvez que ça tourne, dans le compte-rendu, vous me mettez :


- **Résultat**
```js
docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                    NAMES
5097fbc19eef   shitty_app:1.0   "docker-entrypoint.s…"   8 seconds ago   Up 7 seconds   0.0.0.0:3000->3000/tcp   shitty-app

...

curl http://localhost:3000/

    <!DOCTYPE html>
    <html>
      <head>
        <title>HTTP Cat</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f0f0f0;
          }
          img {
            max-width: 90vw;
            max-height: 90vh;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          }
        </style>
      </head>
      <body>
        <img src="https://http.cat/images/200.jpg" alt="HTTP Cat 200 - OK">
      </body>
    </html>


  ...

docker logs 5097fbc19eef

> Shitty webapp for B3 Dev TP1@1.0.0 dev
> nodemon -L src/app.js

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/app.js`
Server running at http://localhost:3000
```


🌞 Lancer un nouveau conteneur à partir de l'image shitty_app

**Commande :**

```bash
docker run -p 3000:3000 -d -v "/home/rori/docker/part2/1/src:/app/src" shitty_app:1.0

```

**Résultat :**

```bash
docker logs 2e

> Shitty webapp for B3 Dev TP1@1.0.0 dev
> nodemon -L src/app.js

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/app.js`
Server running at http://localhost:3000
[nodemon] restarting due to changes...
[nodemon] starting `node src/app.js`
Server running at http://localhost:3000
```

## 4) Compose please

🌞 Transformer ce docker run en compose.yml



```yaml
services:

  app:
    image: shitty_app:1.0
    ports:
      - 3000:3000
    volumes:
      - ./src:/app/src

```

**Résultat du compose up**

```bash
docker compose up
[+] Running 2/2
 ✔ Network 1_default  Created                                                                                      0.1s
 ✔ Container 1-app-1  Created                                                                                      0.1s
Attaching to app-1
app-1  |
app-1  | > Shitty webapp for B3 Dev TP1@1.0.0 dev
app-1  | > nodemon -L src/app.js
app-1  |
app-1  | [nodemon] 3.1.11
app-1  | [nodemon] to restart at any time, enter `rs`
app-1  | [nodemon] watching path(s): *.*
app-1  | [nodemon] watching extensions: js,mjs,cjs,json
app-1  | [nodemon] starting `node src/app.js`
app-1  | Server running at http://localhost:3000
```

## 5) DB please


🌞 Créer un compose.yml

```yml
services:
  db:
    image: mysql:8.4
    environment:
      - MYSQL_ROOT_PASSWORD=123
    volumes:
      - db_data:/var/lib/mysql

  pma:
    image: phpmyadmin
    ports:
      - "8080:80"

  app:
    image: shitty_app_with_db:1.0
    ports:
      - 3000:3000
    volumes:
      - ./src:/app/src
    environment:
      - DB_HOST=db 
      - DB_USER=root
      - DB_PASSWORD=123
      - DB_NAME=db
      - DB_PORT=3306
      - PORT=3000 

volumes:
  db_data:
```

🌞 Allumer la stack et prouver que ça fonctionne

le ps :

```bash
 docker ps
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                    NAMES
0d01724b400f   phpmyadmin               "/docker-entrypoint.…"   7 minutes ago   Up 3 seconds   0.0.0.0:8080->80/tcp     5-pma-1
e155aa8a695e   shitty_app_with_db:1.0   "docker-entrypoint.s…"   7 minutes ago   Up 3 seconds   0.0.0.0:3000->3000/tcp   5-app-1
831b6463839d   mysql:8.4                "docker-entrypoint.s…"   7 minutes ago   Up 3 seconds   3306/tcp, 33060/tcp      5-db-1
```

les curls :

 - le phpmyadmin :
```bash
curl localhost:8080
<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  ...
```
- l'app :

```bash
    <h1>Simple DB App</h1>
      <img src="https://http.cat/images/200.jpg" alt="HTTP Cat 200 - OK">
    <h2>Add User</h2>
    <form method="POST" action="/add">
      <input type="text" name="pseudo" placeholder="Enter pseudo" required>
      <button>Add</button>
    </form>
...
```

- les logs:

```bash
 rori@DESKTOP-PC-DE-RORI:~/docker/part2/5$ docker compose logs
db-1  | 2025-12-15 15:18:29+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
db-1  | 2025-12-15 15:18:29+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
db-1  | 2025-12-15 15:18:29+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
db-1  | 2025-12-15 15:18:29+00:00 [Note] [Entrypoint]: Initializing database files
db-1  | 2025-12-15T15:18:29.821656Z 0 [System] [MY-015017] [Server] MySQL Server Initialization - start.
pma-1  | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.19.0.4. Set the 'ServerName' directive globally to suppress this message
```

🌞 Mettre en place des données persistentes pour la db

deja fait plus haut dans le compose










