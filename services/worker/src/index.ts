import { Queue } from "bullmq";
import { config } from "dotenv";
config();

const connection = { 
  host: process.env.REDIS_HOST || "127.0.0.1", 
  port: Number(process.env.REDIS_PORT || 6379) 
} as const;

const mediaQueue = new Queue("media", { connection });

async function main() {
  await mediaQueue.add("analyse", { 
    s3Key: "raw/example.jpg", 
    memoryId: "00000000-0000-0000-0000-000000000000" 
  });
  console.log("Queued example analyse job");
}

main().catch(err => { 
  console.error(err); 
  process.exit(1); 
});
