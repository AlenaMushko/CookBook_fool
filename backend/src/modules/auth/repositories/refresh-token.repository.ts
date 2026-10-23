import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { hashToken } from '../utils/token-hash.util';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async saveToken(
    userId: string,
    deviceId: string,
    rawRefreshToken: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const tokenHash = hashToken(rawRefreshToken);

    return await this.prisma.refreshToken.create({
      data: {
        userId,
        deviceId,
        tokenHash,
        expiresAt,
      },
    });
  }

  public async isActiveToken(rawRefreshToken: string): Promise<boolean> {
    const tokenHash = hashToken(rawRefreshToken);
    const now = new Date();

    const existing = await this.prisma.refreshToken.findFirst({
      where: {
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
    await this.prisma.refreshToken.deleteMany({
      where: { userId, deviceId },
    });
  }

  public async deleteAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
