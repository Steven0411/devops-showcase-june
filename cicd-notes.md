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

Jenkinsfile in repo
- Pipeline points to this via filepath


## Monitoring
Node.js app must expose /health endpoint
- `prom-client` library

### Prometheus

