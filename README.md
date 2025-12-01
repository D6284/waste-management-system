# KLINCAM Waste Management System

A comprehensive, full-stack waste management platform designed for smart cities.

## Architecture

This is a monorepo containing:
- **/frontend**: React + Vite admin dashboard (this application)
- **/backend**: Node.js + Fastify API (simulated)
- **/mobile**: React Native field worker app
- **/infra**: Terraform + Helm charts for AWS deployment

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Fastify, Prisma, PostgreSQL + PostGIS
- **Infrastructure**: Docker, Kubernetes (EKS), Terraform, GitHub Actions

## Quick Start (Local Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/klincam/wms.git
   cd wms
   ```

2. **Start Infrastructure (Docker Compose)**
   ```bash
   docker-compose up -d postgres redis rabbitmq
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Mobile Setup**
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

## Deployment

Refer to `RUNBOOK.md` for detailed deployment instructions for Staging and Production environments on AWS.

## Documentation

- `CHECKLIST.md`: Production readiness checklist
- `RUNBOOK.md`: Operational runbook
- `ARCHITECTURE.md`: System design and diagrams

## Contact

Support: devops@klincam.com
# waste-management-system
