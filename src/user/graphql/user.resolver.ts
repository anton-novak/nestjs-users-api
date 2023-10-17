import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserPrismaService } from "../prisma/user.prisma.service";
import { User, UserCreateInput, UserUpdateInput } from './user.graphql.schema';
import { UserHelpersService } from "../user.helpers.service";

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserPrismaService, private helpers: UserHelpersService) {}

  @Mutation()
  async createUser(@Args('userCreateInput') args: UserCreateInput) {
    const newUser = await this.userService.createUser(args);
    return newUser;
  }

  @Query()
  async listUsers() {
    const users = await this.userService.listUsers();
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

}