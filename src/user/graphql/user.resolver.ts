import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserPrismaService } from "../prisma/user.prisma.service";
import { UserCreateInput, UserUpdateInput, UserListFilters } from './user.graphql.schema';
import { UserHelpersService } from "../helpers/user.helpers.service";
import { Prisma } from "@prisma/client";

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserPrismaService, private helpers: UserHelpersService) {}

  @Mutation()
  async createUser(@Args('userCreateInput') args: UserCreateInput) {
    const newUser = await this.userService.createUser(args);
    return newUser;
  }

  @Query()
  async listUsers(@Args('filters') args: UserListFilters) {
    let prismaFilter: { where: Prisma.UserWhereInput };
    if (args) {
      try {
        prismaFilter = this.helpers.prismaFilterBuilder(args);
      } catch (error) {
        return error;
      }
    }
    const users = await this.userService.listUsers(prismaFilter);
    return users;
  }

  @Mutation()
  async updateUser(@Args('userUpdateInput') args: UserUpdateInput) {
    const user = await this.userService.updateUser(args);
    return user;
  }

  @Mutation()
  async deleteUser(@Args('id') args: string) {
    const user = await this.userService.deleteUser(args);
    return user;
  }

  @Query()
  async getUser(@Args('id') args: string) {
    console.log(args);
    const user = await this.userService.getUser(args);
    return user;
  }
}