import { Controller, Get } from '@nestjs/common';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

@SkipAuth()
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: string } {
    return { status: 'ok' };
  }
}
