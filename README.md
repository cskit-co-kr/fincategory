```bash
docker build -t registry.gitlab.com/cskit.fincat/fincategory .
```

```bash
docker tag registry.gitlab.com/cskit.fincat/fincategory registry.gitlab.com/cskit.fincat/fincategory:test
```

```bash
docker push registry.gitlab.com/cskit.fincat/fincategory:test
```

.%ryDE.2TJU53w@

## Test server deer

```bash
docker pull registry.gitlab.com/cskit.fincat/fincategory:test
```

```bash
nano docker-compose.yml
```

```bash
docker images
```

```bash
docker container prune
```

```bash
docker compose up -d
```
