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
    throw new Error('GraphQL Email Scalar parser expected a valid email string.');
  }
}

export const DateISOScalar = new GraphQLScalarType({
  name: 'DateISO',
  description: 'Date custom scalar type',
  serialize(value) {
    return checkForDate(value).toISOString();
  },
  parseValue(value) {
    return checkForDate(value).toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return checkForDate(ast.value).toISOString();
    } else {
      return null;
    };
  }
});

function checkForDate(value: unknown) {
  if (typeof value === 'string' || value instanceof Date) {
    const date = new Date(value);
    if (date.toString() === 'Invalid Date') {
      throw new Error('GraphQL DateISO Scalar parser expected a valid date string.');
    } else {
      return date;
    }
  } else {
    throw new Error('GraphQL DateISO Scalar parser expected a valid date string.');
  }
}