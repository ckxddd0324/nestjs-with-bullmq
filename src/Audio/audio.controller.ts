import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
// import  Queue: Q from ('bull');

@Controller('audio')
export class AudioController {
  constructor(@InjectQueue('audio') private readonly audioQueue: Queue) {}

  @Post('transcode')
  async transcode() {
    const job = await this.audioQueue.add(
      'transcode',
      {
        file: 'audio.mp3',
      },
      {
        attempts: 3,
        jobId: randomUUID(),
      },
    );

    return job.id;
  }

  @Patch('completed/:id')
  async markJobCompleted(
    @Param('id') id: string,
    @Body('status') pipelineStatus: string,
  ) {
    console.log(id, 'id');
    const jobStatus = await this.audioQueue.getJob(id);
    if (pipelineStatus) {
      return await jobStatus.moveToCompleted();
    } else {
      return await jobStatus.moveToFailed({ message: 'got failed job!!' });
    }
  }

  @Get('jobs')
  async getJobs() {
    const jobStatus = await this.audioQueue.getJobs([
      'completed',
      'active',
      'waiting',
      'delayed',
      'failed',
      'paused',
    ]);

    return jobStatus;
  }

  @Post('flushall')
  async flushAllJobs() {
    const redis = new Redis();
    return await redis.flushall('ASYNC');
  }
}
