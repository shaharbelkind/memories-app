import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap(){
  const app = await NestFactory.create(AppModule);

  // ✅ Robust CORS: allow :3005 + preflight with Authorization
  const allow = (process.env.CORS_ALLOW || 'http://localhost:3005')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return cb(null, true);                // SSR/tools
      if (allow.includes(origin) || /localhost:\d+$/.test(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','Content-Length','X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(4000);
  console.log('API on http://localhost:4000/graphql');
}
bootstrap();
