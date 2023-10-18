import { GraphQLScalarType, Kind } from "graphql";

export const EmailScalar = new GraphQLScalarType({
  name: 'Email',
  description: 'Email custom scalar type',
  serialize(value) {
    return checkForEmail(value);
  },
  parseValue(value) {
    return checkForEmail(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return checkForEmail(ast.value);
    } else {
      return null;
    };
  }
});

function checkForEmail(value: unknown) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/; 
  if (typeof value === 'string' && value.match(emailRegex)) {
    return value;
  } else {
    throw new Error('GraphQL Email Scalar parser expected an email string.');
  }
}