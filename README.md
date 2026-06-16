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
## Project Milestones
- Vibe code an app
  - Josh, Steven?, Sankalp
- Get Jenkins CI/CD pipeline working
  - Moe, Steven?, Thabo, Sankalp
- Containerize app
  - Thabo, Edmund, Sankalp
- Deploy to AWS
  - Josh, Moe, Edward, Sankalp
  - Terraform: Josh, Moe, Thabo, Edward, Sankalp
- Implement monitoring
  - Edmund
- Finish presentation slides
- Thursday dry run
  - Edward, Josh
- Monday presentation
  - Edward, Josh


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

