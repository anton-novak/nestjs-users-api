import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserPrismaService } from "../prisma/user.prisma.service";
import { UserCreateInput, UserUpdateInput, UserListFilters, DateISO } from './user.graphql.schema';
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
  async listUsers(
    @Args('filters') filters: UserListFilters,
    @Args('take') take: number,
    @Args('cursor') cursor: Prisma.UserWhereUniqueInput
    ) {
      console.log(filters, take, cursor);
    const prismaOptions = {
      take: take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {} as Prisma.UserWhereInput, 
      orderBy: { updatedAt: 'asc' } as Prisma.UserOrderByWithRelationInput
    };

    if (filters) prismaOptions.where = this.helpers.prismaFilterBuilder(filters);

    const rowsCount = await this.userService.countUserRecords({ where: prismaOptions.where });

    // To figure out if there's a next page I either have to fetch the whole list or
    // know the last item's cursor. I'm fetching the last item's cursor which seems more economical.

    const users = await this.userService.listUsers(prismaOptions);
    const lastUser = await this.userService.findLastUser(prismaOptions);
    
    const lastUserIndexInList = users.findIndex(user => user.id === lastUser.id);

    const userResult = {
      totalCount: rowsCount,
      edges: users.length > 0 && users.map(user => {
        return { node: user, cursor: user.id };
      }),
      pageInfo: {
        startCursor: users[0] ? users[0].id : null,
        hasNextPage: lastUserIndexInList === -1 ? true : false
      }
    }

    return userResult;
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