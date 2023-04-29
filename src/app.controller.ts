import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageProducerService } from './message.producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly messageProducerService: MessageProducerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('invoke-msg')
  getInvokeMsg(@Query('msg') msg: string) {
    console.log(msg);
    this.messageProducerService.sendMessage(msg);
    return msg;
  }
}
