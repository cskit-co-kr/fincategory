docker build -t registry.gitlab.com/cskit.fincat/fincategory .

docker tag registry.gitlab.com/cskit.fincat/fincategory registry.gitlab.com/cskit.fincat/fincategory:test

docker push registry.gitlab.com/cskit.fincat/fincategory:test

.%ryDE.2TJU53w@

#Test server deer

docker pull registry.gitlab.com/cskit.fincat/fincategory:test

nano docker-compose.yml

docker images

docker container prune

docker compose up -d
