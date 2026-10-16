import 'dotenv/config';
import app from './app';
import { config } from './config';
import prisma from './lib/prisma';

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    const server = app.listen(config.app.port, () => {
      console.log(`\n🚀 Mwana Global API`);
      console.log(`   Port: ${config.app.port}`);
      console.log(`   Env:  ${config.app.nodeEnv}`);
      console.log(`   URL:  http://localhost:${config.app.port}\n`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Graceful shutdown...`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
