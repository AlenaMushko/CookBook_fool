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

  public async deleteById(id: string): Promise<void> {
    await this.prisma.passwordResetToken.delete({
      where: { id },
    });
  }

  public async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }
}
