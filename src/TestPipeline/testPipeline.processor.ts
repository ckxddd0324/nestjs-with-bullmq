import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';

@Processor('testPipelineQueue', { concurrency: 5, lockDuration: 300000 })
export class TestProcessor extends WorkerHost {
  constructor() {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    // Specify a unique token
    const token = 'my-token';

    const getJob = (await this.worker.getNextJob(token)) as Job;
    console.log(job);
    // Access job.data and do something with the job
    // processJob(job.data)

    await timeout(100000000);
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    // do some
    console.log('complete');
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
