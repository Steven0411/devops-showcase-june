Project name
- Snakes & Ladders

Date
- 22 / 06 / 2026

Execute summary
- We are aiming to complete an end-to-end DevOps pipeline, including containerization and monitoring, to be presented to a mixed audience.
- The project will last ~4 days. The team will divide into various subteams and individual work based on Roles.

Project Goals / Objectives
- Complete a successful end-to-end DevOps pipeline and present it to a mixed audience (technical and non-technical).

Tools 
- Docker
- Jenkins
- AWS
- Terraform
- Prometheus 
- Grafana
- GitHub

Constraints & Assumptions
- Time frame: 1 week

Project Deliverables (Scope)
- Cloud hosted app
- CI/CD pipeline
- Working demo
- Project documentation
- Presentation (with a lot of diagrams…)

Project Milestones
- Vibe code an app
  - Josh, Steven, Sankalp
- Get Jenkins CI/CD pipeline working
  - Moe, Thabo, Edmund
- Containerize app
  - Thabo, Edmund, Moe
- Deploy to AWS
  - Josh, Edward, Sankalp, steven, 
  - Terraform: Josh, priyan, Edward, Sankalp, steven
- Implement monitoring
  - Edmund
- Finish presentation slides
- Thursday dry run
  - Edward, Josh, priyan
- Monday presentation
  - Edward, Josh, priyan

Work breakdown structure (Roles)
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


