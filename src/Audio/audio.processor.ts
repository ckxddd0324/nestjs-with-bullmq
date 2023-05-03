import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueStalled,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
@Processor('audio')
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);

  @Process({ name: 'transcode', concurrency: 5 })
  async handleTranscode(job: Job) {
    try {
      const timeout_sec = randomIntFromInterval(300, 1000) * 100;
      this.logger.debug('Start transcoding...');
      this.logger.debug(job.data);
      await timeout(100000000);
      this.logger.debug('Transcoding completed');
      console.log(job);
    } catch (error) {
      // move the task to failed jobs
      await job.moveToFailed({ message: 'task processing failed..' });
      console.error(error); // log the error
    }
  }

  @OnQueueStalled()
  onStalled(job: Job) {
    console.log(
      `Stalled job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  OnCompleted(job: Job) {
    console.log(
      `Completed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueWaiting()
  OnWaiting(job: Job) {
    console.log(
      `Waiting job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueFailed()
  OnFailed(job: Job) {
    console.log(
      `Failed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
