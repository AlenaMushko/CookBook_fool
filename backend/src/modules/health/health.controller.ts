import { Controller, Get } from '@nestjs/common';

import { ApiRoute } from '../../common/constants/api-route.enum';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

export type HealthResponse = {
  status: 'ok';
  commit: string | null;
};

export function healthPayload(
  commit: string | undefined = process.env.RENDER_GIT_COMMIT,
): HealthResponse {
  const value = commit?.trim();
  return { status: 'ok', commit: value ? value : null };
}

@SkipAuth()
@Controller(ApiRoute.HEALTH)
export class HealthController {
  @Get()
  check(): HealthResponse {
    return healthPayload();
  }
}
