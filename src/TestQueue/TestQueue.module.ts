import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TestQueueController } from './TestQueue.controller';
import { QueueProcessor } from './TestQueue.processor';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'TestQueue',
      settings: {
        lockDuration: 1200000,
      },
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [TestQueueController],
  providers: [QueueProcessor],
})
export class TestQueueModule {}
