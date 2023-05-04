import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Worker, Job } from 'bullmq';
@Injectable()
export class TestPipelineService {
  private readonly logger = new Logger(TestPipelineService.name);

  constructor(
    @InjectQueue('testPipelineQueue') private testPipelinQueue: Queue,
  ) {
    testPipelinQueue.token = 'my-token';
  }

  async sendMessage(message: string) {
    this.logger.debug('message');
    await this.testPipelinQueue.add(
      'message-job',
      {
        text: message,
      },
      { jobId: randomUUID() },
    );
  }

  async updateJobStatus(id, succeeded) {
    const worker = new Worker('my-queue');
    const workerJob = await worker.getNextJob('my-token');
    console.log(workerJob);
    const job = await this.testPipelinQueue.getJob(id);
    console.log(job);
    // Access job.data and do something with the job
    // processJob(job.data)
    if (succeeded) {
      await job.moveToCompleted('some return value', 'my-token', true);
    } else {
      await job.moveToFailed(new Error('my error message'), 'my-token', true);
    }

    worker.close();
    new Worker('my-queue');
  }
}
