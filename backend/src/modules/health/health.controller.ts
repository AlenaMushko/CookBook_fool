import { Controller, Get } from '@nestjs/common';

import { ApiRoute } from '../../common/constants/api-route.enum';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

@SkipAuth()
@Controller(ApiRoute.HEALTH)
export class HealthController {
  @Get()
  check(): { status: string } {
    return { status: 'ok' };
  }
}
