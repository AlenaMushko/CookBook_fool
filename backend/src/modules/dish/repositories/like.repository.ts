import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LikeRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findByUserAndDish(userId: string, dishId: string) {
    return await this.prisma.like.findUnique({
      where: { dishId_userId: { dishId, userId } },
    });
  }

  public async create(userId: string, dishId: string) {
    return await this.prisma.like.create({ data: { userId, dishId } });
  }

  public async delete(userId: string, dishId: string) {
    await this.prisma.like.deleteMany({ where: { userId, dishId } });
  }

  public async getSavedDishIds(userId: string): Promise<string[]> {
    const likes = await this.prisma.like.findMany({
      where: { userId },
      select: { dishId: true },
    });
    return likes.map((l) => l.dishId);
  }

  public async isSaved(userId: string, dishId: string): Promise<boolean> {
    const like = await this.findByUserAndDish(userId, dishId);
    return !!like;
  }
}
