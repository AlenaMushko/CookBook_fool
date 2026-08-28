import { Injectable } from '@nestjs/common';
import { PasswordResetToken } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<PasswordResetToken> {
    return await this.prisma.passwordResetToken.create({ data });
  }

  public async findByTokenHash(
    tokenHash: string,
  ): Promise<PasswordResetToken | null> {
    return await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
  }

  public async markUsed(id: string): Promise<void> {
    await this.prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  public async invalidateUserTokens(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });
  }
}
