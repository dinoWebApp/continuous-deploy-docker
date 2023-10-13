import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService:WebhookService) {}

  //이미지 정보 수신
  @Post()
  async handleWebhook(@Body() data:any): Promise<string> {
    return this.webhookService.handleWebhook(data);
  }
}
