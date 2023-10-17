import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { UserPrismaService } from "./prisma/user.prisma.service";
import { UserController } from "./user.controller";
import { UserResolver } from "./graphql/user.resolver";
import { UserHelpersService } from "./user.helpers.service";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['src/user/graphql/*.gql'],
      definitions: {
        path: join(process.cwd(), 'src/user/graphql/user.graphql.schema.ts'),
        outputAs: 'class'
      }
    }),
    ConfigModule.forRoot()
  ],
  controllers: [UserController],
  providers: [UserPrismaService, UserResolver, UserHelpersService],
  exports: []
})

export class UserModule {}