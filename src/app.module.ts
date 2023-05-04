import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TestPipelineService } from './TestPipeline/testPipeline.service';
import { TestPipelineController } from './TestPipeline/testPipeline.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestProcessor } from './TestPipeline/testPipeline.processor';
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'testPipelineQueue',
      defaultJobOptions: { attempts: 3 },
    }),
  ],
  controllers: [AppController, TestPipelineController],
  providers: [AppService, TestPipelineService, TestProcessor],
})
export class AppModule {}
