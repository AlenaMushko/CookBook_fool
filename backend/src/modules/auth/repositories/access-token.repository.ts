import { Injectable } from '@nestjs/common';
import { AccessToken } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { hashToken } from '../utils/token-hash.util';

@Injectable()
export class AccessTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async saveToken(
    userId: string,
    deviceId: string,
    rawAccessToken: string,
    expiresAt: Date,
  ): Promise<AccessToken> {
    const tokenHash = hashToken(rawAccessToken);

    await this.prisma.accessToken.deleteMany({
      where: { userId, deviceId },
    });

    return await this.prisma.accessToken.create({
      data: {
        userId,
        deviceId,
        tokenHash,
        expiresAt,
      },
    });
  }

  public async isActiveToken(
    userId: string,
    deviceId: string,
    rawAccessToken: string,
  ): Promise<boolean> {
    const tokenHash = hashToken(rawAccessToken);
    const now = new Date();

    const existing = await this.prisma.accessToken.findFirst({
      where: {
        userId,
        deviceId,
        tokenHash,
        expiresAt: { gt: now },
      },
      select: { id: true },
    });

    return Boolean(existing);
  }

  public async deleteByUserAndDevice(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await this.prisma.accessToken.deleteMany({
      where: { userId, deviceId },
    });
  }

  public async deleteAllByUserId(userId: string): Promise<void> {
    await this.prisma.accessToken.deleteMany({ where: { userId } });
  }
}
