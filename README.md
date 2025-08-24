# Life Story Capsule — Monorepo (code drop v1)

## Prereqs
- Node 20+, pnpm 9+, Python 3.10+, Docker Desktop

## 1) Start infrastructure
```bash
docker compose -f docker-compose.dev.yml up -d
```
Create the S3 bucket in MinIO console (http://localhost:9001): `lsc-bucket`.

## 2) Environment
Copy `.env.example` to `.env` in repo root and adjust if needed.

## 3) Install deps
```bash
pnpm install
```

## 4) Database schema (Prisma)
```bash
cd services/api
pnpm prisma generate
pnpm exec prisma migrate dev --name init
pnpm dev
```
API: http://localhost:4000/graphql

## 5) AI service
```bash
cd services/ai
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py
```
AI: http://localhost:7000/health

## 6) Worker
```bash
cd services/worker
pnpm dev
```

## 7) Web app
```bash
cd apps/web
pnpm dev
```
Web: http://localhost:3000

## 8) Admin app
```bash
cd apps/admin
pnpm dev
```

## Notes
- This is a runnable **full-stack scaffold** wired for GraphQL, AI service stubs, and worker queues. Replace AI placeholders with your models, add upload/signing, and expand the UI per spec.
- For production: add authentication (Cognito), object storage signing, job orchestration, observability, and CI/CD.
