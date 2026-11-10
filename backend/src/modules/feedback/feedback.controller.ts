import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { apiPath, ApiRoute } from '../../common/constants/api-route.enum';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@ApiTags('Feedback')
@Controller(apiPath(ApiRoute.FEEDBACK))
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @SkipAuth()
  @Post()
  @HttpCode(204)
  @ApiOperation({ summary: 'Send feedback to the app owner' })
  public async send(@Body() dto: CreateFeedbackDto): Promise<void> {
    await this.feedbackService.send(dto);
  }
}
