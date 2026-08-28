import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async saveToken(
    userId: string,
    deviceId: string,
    token: string,
  ): Promise<RefreshToken> {
    return await this.prisma.refreshToken.create({
      data: {
        userId,
        deviceId,
        refreshToken: token,
      },
    });
  }

  public async isTokenExist(token: string): Promise<boolean> {
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { refreshToken: token },
    });
    return !!existingToken;
  }

  public async deleteByUserAndDevice(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId, deviceId },
    });
  }

  public async deleteAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
