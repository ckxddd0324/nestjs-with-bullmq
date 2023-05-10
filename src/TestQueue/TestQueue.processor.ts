import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { rejects } from 'assert';
import { throwError } from 'rxjs';

@Injectable()
@Processor('TestQueue')
export class QueueProcessor {
  constructor(
    @InjectQueue('TestQueue') private readonly queue: Queue,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Process({ name: 'transcode', concurrency: 3 })
  async handleMyJob(job: Job): Promise<void> {
    console.log(`Processing job with ID ${job.id}1`);

    // let testPipelineStatus = 'pending';
    // console.log('   ', status);
    // let timeElapsed = 0;
    // const timeoutMs = 15 * 1000; // Check status every 15 seconds 1
    // const maxTimeMs = 20 * 60 * 1000; // Check for a maximum of 20 minutes
    // let currentJob: Job;
    // while (testPipelineStatus == 'pending' && timeElapsed < maxTimeMs) {
    //   await new Promise((resolve) => setTimeout(resolve, timeoutMs));

    //   currentJob = await this.queue.getJob(job.id);
    //   timeElapsed += timeoutMs;
    //   console.log(await currentJob.data.jobStatus, '====');
    //   testPipelineStatus =
    //     (await currentJob.data.jobStatus) === 'pending'
    //       ? 'pending'
    //       : await currentJob.data.jobStatus;
    //   console.log('current job status: ', testPipelineStatus, ' and ', job.id);
    // }
    // console.log('starting update the job');
    // if (testPipelineStatus === 'completed') {
    //   console.log('update to completed');
    //   await currentJob.moveToCompleted('me?');
    // } else if (testPipelineStatus === 'failed') {
    //   console.log('update tofailed');
    //   await currentJob.update({ ...currentJob.data, jobStatus: 'pending' });
    //   await currentJob.moveToFailed({ message: 'fail' });
    // }

    return await new Promise((resolve, reject) => {
      this.eventEmitter.on('myevent', async (data) => {
        console.log(`Received SSE event: ${data}`);

        // Update job status data
        const currentJob = await this.queue.getJob(job.id);
        console.log(currentJob);
        try {
          console.log('inside');
          if (currentJob.data.jobStatus === 'completed') {
            console.log('inside if');
            resolve();
          } else if (currentJob.data.jobStatus === 'failed') {
            await job.update({ ...job.data, jobStatus: 'pending' });
            reject('failing tests! ret!ry');
          }
        } catch (error) {
          console.error(error);
        }
      });
    });
    // Wait for job to complete
  }
}
