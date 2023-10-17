import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient, User, Prisma } from "@prisma/client";

@Injectable()
export class UserPrismaService extends PrismaClient implements OnModuleInit {
  // Spin up the Prisma client.
  async onModuleInit() {
    await this.$connect()
      .then(() => console.log('[user.prisma.service]: Prisma client initialized'));
  }

  // Define CRUD methods for Prisma data access layer.
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.user.create({
      data
    });
  }

  async getUser(id: string): Promise<User> {
    return this.user.findUnique({
      where: {id: id } as Prisma.UserWhereUniqueInput
    });
  }

  // TODO: Research pagination.
  async listUsers(): Promise<User[]> {
    return this.user.findMany({});
  }

  async updateUser(data: Prisma.UserUpdateInput): Promise<User> {
    data.updatedAt = new Date;
    return this.user.update({
      data: data,
      where: { id: data.id } as Prisma.UserWhereUniqueInput
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.user.delete({
      where: { id: id } as Prisma.UserWhereUniqueInput
    });
  }
}