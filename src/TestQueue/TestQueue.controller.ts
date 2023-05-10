import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
@Controller('testqueue')
export class TestQueueController {
  constructor(
    @InjectQueue('TestQueue') private readonly queue: Queue,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post('add-job')
  async transcode() {
    const job = await this.queue.add(
      'transcode',
      {
        file: 'audio.mp3',
        jobStatus: 'pending',
      },
      {
        attempts: 3,
        jobId: randomUUID(),
      },
    );

    return job.id;
  }

  @Post('webhook')
  async handleWebhook(
    @Body('status') status: string,
    @Body('jobId') jobId: string,
  ): Promise<void> {
    console.log(jobId, status, 'controller');
    // const { jobId, status } = body;
    const job = await this.queue.getJob(jobId);
    if (!job) {
      return;
    }

    this.eventEmitter.emit(
      'myevent',
      await job.update({ ...job.data, jobStatus: status }),
    );

    // if (status === 'completed') {
    //   return await job.update({ ...job.data, jobStatus: 'completed' });
    //   //   await job.moveToCompleted();
    // } else if (status === 'failed') {
    //   return await job.update({ ...job.data, jobStatus: 'failed' });
    //   //   await job.moveToFaile
    // }
  }
}
