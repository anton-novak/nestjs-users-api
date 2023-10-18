import { Injectable } from "@nestjs/common";
import { User, Prisma } from "@prisma/client";
import { UserPrismaClient } from "./user.prisma.client";

@Injectable()
export class UserPrismaService {
  constructor(private prisma: UserPrismaClient) {}

  // Define CRUD methods for Prisma data access layer.
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data
    });
  }

  async getUser(id: string): Promise<User> {
    let user = await this.prisma.user.findUnique({
      where: {id: id } as Prisma.UserWhereUniqueInput
    });
    return user;
  }

  async listUsers(prismaOptions: { where: Prisma.UserWhereInput }): Promise<User[]> {
    let users = await this.prisma.user.findMany(prismaOptions);
    return users;
  }

  async findLastUser(prismaOptions: { where: Prisma.UserWhereInput }): Promise<User> {
    const sanitizedPrismaOptions = { 
      where: prismaOptions.where, 
      orderBy: { updatedAt: 'desc' } as Prisma.UserOrderByWithRelationInput
    };
    let user = await this.prisma.user.findFirst(sanitizedPrismaOptions);
    return user;
  }

  async countUserRecords(prismaFilter: { where: Prisma.UserWhereInput }): Promise<number> {
    let count = await this.prisma.user.count(prismaFilter);
    return count;
  }

  async updateUser(data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      data: data,
      where: { id: data.id } as Prisma.UserWhereUniqueInput
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id: id } as Prisma.UserWhereUniqueInput
    });
  }
}