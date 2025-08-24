import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import { renderYearbook } from './yearbook.js';

dotenv.config();
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});
export const renderQueue = new Queue('render', { connection });

new Worker('render', async job => {
  if(job.name === 'yearbook'){
    const key = await renderYearbook(job.data);
    return { key };
  }
}, { connection });
