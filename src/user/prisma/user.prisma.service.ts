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
    console.log(user);
    return user;
  }

  // TODO: Research pagination.
  async listUsers(prismaFilter: { where: Prisma.UserWhereInput }): Promise<User[]> {
    let users = await this.prisma.user.findMany(prismaFilter);
    return users;
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