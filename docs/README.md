# Life Story Capsule Monorepo

This is the scaffold for the Life Story Capsule platform.

## Structure

- `apps/web` - Next.js 14 web application
- `apps/admin` - Next.js 14 admin console  
- `apps/mobile` - Expo React Native mobile app
- `services/api` - NestJS GraphQL API
- `services/ai` - FastAPI AI microservices
- `services/worker` - Node.js BullMQ workers
- `packages/ui` - Shared React components
- `packages/types` - Shared TypeScript types
- `packages/config` - Shared configs (ESLint, TypeScript, Prettier)
- `infra/terraform` - AWS infrastructure as code
- `k8s/` - Kubernetes manifests

## Getting Started

1. Install dependencies: `pnpm install`
2. Start development: `pnpm dev`

See `/infra/terraform` for IaC and `/k8s` for Kubernetes manifests.
