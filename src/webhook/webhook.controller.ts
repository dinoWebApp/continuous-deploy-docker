import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService:WebhookService) {}

  @Post()
  async handleWebhook(@Body() data:any): Promise<string> {
    return this.webhookService.handleWebhook(data);
  }
}
