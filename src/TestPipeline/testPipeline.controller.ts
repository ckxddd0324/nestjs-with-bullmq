import { Controller, Get, Query } from '@nestjs/common';
import { TestPipelineService } from './testPipeline.service';
@Controller('audio')
export class TestPipelineController {
  constructor(private readonly testPipelineService: TestPipelineService) {}

  @Get('invoke-msg')
  async getInvokeMsg(@Query('msg') msg: string) {
    console.log(msg);
    await this.testPipelineService.sendMessage(msg);
    return msg;
  }

  @Get('get-jobs')
  async getJobs(@Query('id') id: string) {
    console.log(id);
    await this.testPipelineService.updateJobStatus(id, true);
    // return msg;
  }
}
