import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  public async save(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.prisma.user.update({ where, data });
  }

  public async findOne(
    where: Prisma.UserWhereInput,
    select?: Prisma.UserSelect,
  ): Promise<User | null> {
    return await (this.prisma.user.findFirst({
      where,
      ...(select ? { select } : {}),
    }) as Promise<User | null>);
  }

  public async findOneBy(where: Prisma.UserWhereInput): Promise<User | null> {
    return await this.prisma.user.findFirst({ where });
  }
}
