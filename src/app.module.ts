import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestQueueController } from './TestQueue/TestQueue.controller';
import { TestQueueModule } from './TestQueue/TestQueue.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TestQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
