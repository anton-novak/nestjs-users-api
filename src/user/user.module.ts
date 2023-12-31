import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { UserPrismaService } from "./prisma/user.prisma.service";
import { UserResolver } from "./graphql/user.resolver";
import { UserHelpersService } from "./helpers/user.helpers.service";
import { UserPrismaClient } from "./prisma/user.prisma.client";
import { EmailScalar, DateISOScalar } from "./graphql/user.custom.scalars";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['src/user/graphql/*.gql'],
      definitions: {
        path: join(process.cwd(), 'src/user/graphql/user.graphql.schema.ts'),
        outputAs: 'class'
      },
      resolvers: { Email: EmailScalar, DateISO: DateISOScalar }
    }),
    ConfigModule.forRoot()
  ],
  controllers: [],
  providers: [UserPrismaService, UserResolver, UserHelpersService, UserPrismaClient],
  exports: []
})

export class UserModule {}