# Rendu cours docker TP3

l'ensemble du tp3 se trouve sur le gitlab : https://gitlab.com/b3-dev-efrei-2025/tp3-rori


ou dans le dossier tp2 (oui oui) situé à la racine de ce projet

dans le doute voici le .gitlab-ci.yml final à la fin du tp3 (j'ai enlevé le job d'analyse statique que je n'arrivais pas à faie marcher) :

```yml
# On définit une image Docker dans laquelle seront exécutés les tests
# En la définissant ici, au niveau global de notre yml, c'est l'image qui sera utilisée par défaut pour tous les jobs
image: node:24.12

# On déclare la liste des stages, dans l'ordre
stages:
  - lint
  - test
  - vuln
  - dependency
  - publish
  - static-scan

variables:
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA


lint-stage:
  stage: lint                      # un job est obligatoirement dans un stage déclaré
  before_script:                   # des tâches à exécuter avant les tâches principales de ce job : on prépare l'environnement
    - npm install --save-dev eslint
    - npx eslint -c ./eslint.config.js
  script:                          # les tâches principales de notre job
    - npx eslint

test-stage:
  stage: test
  script:
    - npm run test

vuln-stage:
  stage: vuln
  image: returntocorp/semgrep:latest
  script:
    - semgrep --config p/javascript --error "$CI_PROJECT_DIR"

dependency-stage:
  stage: dependency
  image: node:24.12
  script:
    - npm install
    - npm audit --audit-level=high

build-and-push:
  image:
    name: moby/buildkit:rootless  # l'image standard pour use buildkit en standalone (sans docker)
    entrypoint: [""]              # pour faire ça clean (sans avoir besoin de droits root), j'vais pas détailler ici (ask me), mais cette conf est obligatoire
  stage: publish
  # variable obligatoire pour buildkit en standalone
  variables:
    BUILDKITD_FLAGS: --oci-worker-no-process-sandbox 
  # un before_script qui stocke localement pour ce job de quoi s'authentifier auprès du Container Registry Gitlab
  before_script:                                     
    - mkdir -p ~/.docker
    - |
      echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" \
      > ~/.docker/config.json
  # on build + push en une seule commande buildkit
  # remplace ./test par le dossier qui contient ton Dockerfile
  # remplace <DOCKERFILE_NAME> par le nom de de ton fichier Dockerfile
  script:
    - |
      buildctl-daemonless.sh build \
        --frontend dockerfile.v0 \
        --local context=./ \
        --local dockerfile=./ \
        --opt filename=Dockerfile \
        --output type=image,name=$IMAGE_TAG,push=true
```