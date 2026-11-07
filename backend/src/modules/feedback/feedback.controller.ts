import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { apiPath, ApiRoute } from '../../common/constants/api-route.enum';
import { AUTH_COOKIE_NAMES } from '../auth/constants/constants';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
@ApiTags('Feedback')
@Controller(apiPath(ApiRoute.FEEDBACK))
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @HttpCode(204)
  @ApiOperation({ summary: 'Send feedback to the app owner' })
  public async send(@Body() dto: CreateFeedbackDto): Promise<void> {
    await this.feedbackService.send(dto);
  }
}
