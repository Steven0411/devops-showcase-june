# Devops Showcase June

## Roles
- Priyan - (back from doctor’s appointment at ~11:00)
- Josh - App Development, Terraform, AWS, Presentation Quality, Presenting
- Moe - Jenkins, don’t mind AWS, Terraform
- Steven - Anything Technical
- Thabo - Jenkins, Docker, Terraform
- Edward - terraform, aws, presenting intro
- Edmund - Docker, Monitoring
- Sankalp - AWS, Terraform, Docker, AI(if wanted), anything

---
NOTE: end-to-end devops == taking a simple project through the full lifecycle
- i.e. dev -> build -> test -> containerize -> deploy -> monitor

TODO:
- Simple app + version control
- CI, on commit:
  - Install dependencies
  - Run tests
  - Build app
  - Stop pipeline if anything fails
- Containerization
  - Package app so it runs the same anywhere
  - Create a Dockerfile, build an image, run it as a container
  - Image pushed to registry
- CD
  - Pulls Docker image from registry
  - Deploys it to server
  - Runs health checks
- Monitor (Prometheus + Grafana)

