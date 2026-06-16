## Pipeline overview
1. Trigger
   - Jenkins pipeline triggered via webhook
2. Jenkins pulls from GitHub
3. Install dependencies, run unit tests
4. Build docker image from Dockerfile
5. Push image to registry (Docker Hub or GitHub Container Registry)
6. Deploy
   - Stop old container
   - Pull new image
   - Start new container via docker-compose
   - [App + monitoring stack docker-compose.yaml](docker-compose.yaml)

Jenkinsfile in repo
- Pipeline points to this via filepath
  
Jenkinsfile
- NEEDS TO BE UPDATED TO DEPLOY TO EC2
- SSH into EC2, `docker compose up -d`
- EC2 ports: `22` (SSH), `3000` (app), `3001` (grafana), `9090` (prometheus)


## Monitoring
### Prometheus
Node.js app must expose `/metrics` endpoint
- `prom-client` library
  - `npm install prom-client express`
- [Exposing /metrics endpoint, example js](metrics-endpoint.js)

[Prometheus config file](prometheus.yaml)

Run Prometheus and Grafana as containers...
- Focus on HTTP requests, latency, error rates
- Not just CPU graphs (or monitoring Docker itself)


