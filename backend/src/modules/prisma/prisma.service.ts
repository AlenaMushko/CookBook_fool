import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

import { Config, PostgresConfig } from '../../config/config.type';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService<Config>) {
    const postgres = configService.get<PostgresConfig>('postgres');
    const databaseUrl =
      process.env.DATABASE_URL ||
      `postgresql://${encodeURIComponent(postgres.user)}:${encodeURIComponent(postgres.password)}@${postgres.host}:${postgres.port}/${postgres.dbName}?schema=public`;

    super({
      datasources: {
        db: { url: databaseUrl },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
