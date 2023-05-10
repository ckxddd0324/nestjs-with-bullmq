import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Queue = require('bull');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues/');

  const queue = new Queue('TestQueue');

  createBullBoard({
    queues: [new BullAdapter(queue)],
    serverAdapter: serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());
  await app.listen(3000);
}
bootstrap();
