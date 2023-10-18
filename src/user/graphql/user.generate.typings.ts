// A script to be run manually to generate typings for the User GraphQL schema.
// npm run genTypes
import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['src/user/graphql/*.gql'],
  path: join(process.cwd(), 'src/user/graphql/user.graphql.schema.ts'),
  outputAs: 'class',
});