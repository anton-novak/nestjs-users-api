import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class UserPrismaClient extends PrismaClient implements OnModuleInit {
  // Spin-up the Prisma client. Standalone module to be replaced when mocking for tests.
  async onModuleInit() {
    await this.$connect()
      .then(() => console.log('[user.prisma.client]: Prisma client initialized'));
  }
}