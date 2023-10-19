# Back-end API for managing users

This repo holds code that can help set up a back-end API for managing a userbase.

# Features

* Standalone NestJS app module for easy modification and importing into other apps
* Single-endpoint GraphQL API with filtering and pagination options
* GraphQL-based data validation and error handling
* Dependable data access layer based on PostgreSQL with Prisma ORM

# Roadmap

* More filtering options
* Authentication support
* End-to-end tests

# Starting up in development mode

Prerequisites:
* [Node.js](https://nodejs.org/en) installed
* TypeScript (`npm i -g typescript`) installed
* [PostgreSQL](https://www.postgresql.org/) installed and set up

Clone this repo, run `npm i` from top directory in your OS terminal to install the dependencies. Create a `.env` file in `/src/user` directory and populate it with the database connection string (example below):

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/postgres?schema=public"
```

Then, do the Prisma migration to sync the database schema with the Prisma schema: run `npx prisma migrate dev` from `/src/user` directory and follow the command line prompts.

After that you should be good to go. You can run `npm start` command from the repo directory and interact with the API via code, API testing software like Postman or Thunderclient, or the interactive GraphQL playground available at `http://localhost:3000/graphql` (recommended). If you wish to change the server port, edit the `main.ts` file.

## How to use the API

The API exposes a single GraphQL `POST` endpoint at `http://localhost:3000/graphql` (default URL and path). 

To use it you have to be familiar with the concept of GraphQL. In short, this software sits on top of your data access layer and accepts queries (non-destructive requests alike `GET` requests to a RESTful API) and mutations (destructive requests that resemble `POST`, `PUT` and `DELETE` requests in REST). The queries and mutations are customizable and allow and require you to tell the API what fields of objects you need in the response. Filtering and sorting of output are possible too, provided that the logic under the hood allows it.

The API accomodates queries and mutations that ultimately work with objects of `User` type with the following properties:

```GraphQL
# GraphQL schema
type User {
  id: ID
  firstName: String
  lastName: String
  email: Email
  createdAt: DateISO
  updatedAt: DateISO
}
```
To send a GraphQL query or mutation, make a `POST` request with `Content-Type` header set to `application/json` and include a `JSON` object with the property `query` or `mutation` with the GraphQL string as a value in the body of the request. If you use GraphQL variables syntax, include `variables` object in the body of the request as well.

```JavaScript
// JavaScript example
fetch("http://localhost:3000/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ 
    // $id marks a GraphQL variable which, if used, must be included into 
    // variables property of the body object. You can also write 
    // inputs inline and skip the `variables` property.
    query: `
      query user($id: ID!) {
        getUser(id: $id) {
          firstName
          lastName
          email
          createdAt
        }
      }
    `,
    variables: {
      "id": "3daa7939-4bf3-4eaf-bfbf-a0c50a6a1c13"
    }
    })
});
```

### `createUser`

`createUser` mutation creates a user record in the database and accepts `userCreateInput` input object: 

```GraphQL
# GraphQL schema
input UserCreateInput {
  firstName: String!
  lastName: String!
  email: Email!
}
```
All fields are mandatory, and the value of the `email` is checked for being a proper email string. The rest of the fields of `User` type are populated by the database automatically.

**Example**
```GraphQL
mutation {
  createUser(
    userCreateInput: {firstName: "Richy", lastName: "Rich", email: "boss@outlook.com"}
  ) {
    id
    firstName
    lastName
    email
    createdAt
    updatedAt
  }
}
```
**JSON output**
```JSON
// JSON
{
  "data": {
    "createUser": {
      "id": "8ebaeff8-92fe-4877-86ef-37d6ffe94102",
      "firstName": "Richy",
      "lastName": "Rich",
      "email": "boss@outlook.com",
      "createdAt": "2023-10-18T21:59:04.736Z",
      "updatedAt": "2023-10-18T21:59:04.736Z"
    }
  }
}
```
### `getUser`

`getUser` query returns a user record from the database and takes `id` as input:

```GraphQL
query {
  getUser(id: "3daa7939-4bf3-4eaf-bfbf-a0c50a6a1c13") {
    firstName
    lastName
    email
    createdAt
  }
}
```

### `listUsers`

`listUsers` query returns an object containing user records and pagination information. Query format follows the Relay pagination specification ([Apollo blog post](https://www.apollographql.com/blog/graphql/pagination/understanding-pagination-rest-graphql-and-relay/) on that). 

**Basic query**
```GraphQL
query {
  listUsers {
	  totalCount,
    edges {
      cursor,
      node {
        firstName
        lastName
        id
        email
        updatedAt
      }
    },
    pageInfo {
      startCursor,
      hasNextPage
    }
  }
}
```
User records in the output, i.e., nodes, **are sorted in ascending order based on the time user records were updated** (`updatedAt` field in the schema) to introduce some consistency for pagination.

#### Pagination

By default, the `listUsers` query will provide the whole list of users. To leverage pagination and request user records in batches, provide the following inputs to the query: 
* `take`: a number that tells the API how much items you want in a batch starting from the `cursor` (you can omit `cursor` input on the first call to the API to get the first chunk starting from the oldest record)
* `cursor`: a UUID string that points to the record from which you want to get the next batch of records (the `cursor` record is skipped on that call to prevent fetching duplicates in consecutive calls to the API)

When you hit the last page the `hasNextPage` Boolean flag will turn `false` telling you to stop fetching. 

**Example**
```GraphQL
# This query will fetch 3 user records following a user record with the specified id.
query {
  listUsers(take: 3, cursor: "a3a8a8a4-4e97-4b61-8b75-69aa4eb4164c") {
    totalCount,
    edges {
      cursor,
      node {
        firstName
        lastName
        email
        updatedAt
      }
    },
    pageInfo {
      startCursor,
      hasNextPage
    }
  }
}
```
**JSON output**
```JSON
// JSON
{
  "data": {
    "listUsers": {
      "totalCount": 12,
      "edges": [
        {
          "cursor": "70252064-6fbd-4ede-9956-dbd5b3800922",
          "node": {
            "firstName": "Agent",
            "lastName": "K",
            "email": "mibk@mib.com",
            "updatedAt": "2023-10-18T14:28:09.539Z"
          }
        },
        {
          "cursor": "774513d1-6a58-4ba1-8bf6-9b22d3055299",
          "node": {
            "firstName": "Agent",
            "lastName": "J",
            "email": "mibj@mib.com",
            "updatedAt": "2023-10-18T15:36:40.332Z"
          }
        },
        {
          "cursor": "3daa7939-4bf3-4eaf-bfbf-a0c50a6a1c13",
          "node": {
            "firstName": "Agent",
            "lastName": "Z",
            "email": "mibz@mib.com",
            "updatedAt": "2023-10-18T16:13:11.366Z"
          }
        }
      ],
      "pageInfo": {
        "startCursor": "70252064-6fbd-4ede-9956-dbd5b3800922",
        "hasNextPage": true
      }
    }
  }
}
```
#### Filtering

The `listUsers` query allows to filter user records based on the date of creation, e.g., to determine the newest users or the the users with the most time with the app. To filter, include `createdAtFilter` object into the list of `filters` in query inputs. The object has `before` and `after` (inclusive) properties that can be used together or independently to define time periods and take date strings in [ISO format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format): `"2023-10-18T16:13:11.366Z"`. In theory, the date filter can work with any date string that can be recognized by the JavaScript `Date()` object constructor like `"2023"`, but as the official documentation says there's no guaranteed support for anything but the ISO format. If you provide an invalid date string (or not a string), the API will return an error.

The filter can be combined with pagination, so you are able to fetch filtered data in chunks as well.

**Example**
```GraphQL
query {
  listUsers(
    take: 5
    filters: { createdAtFilter: { before: "2023-10-18T14:28:09.539Z" } }
  ) {
    totalCount
    edges {
      cursor
      node {
        firstName
        lastName
        email
        updatedAt
      }
    }
    pageInfo {
      startCursor
      hasNextPage
    }
  }
}
```
### `updateUser`

`updateUser` mutation updates a user record in the database and accepts `userUpdateInput` input object with mandatory `id` field to point to the user record to be updated:

**Example**
```GraphQL
mutation {
  updateUser(
    userUpdateInput: {
      id: "d65a99de-c772-4f8e-8710-462532f8ac62",
      firstName: "Hi"
      lastName: "Bye"
    }
  ) {
    id
    firstName
    lastName
  }
}
```
The `JSON` output is the updated user record.

### `deleteUser`
`deleteUser` mutation deletes a user record in the database and accepts `id` as input to point to the user record to be deleted.

**Example**
```GraphQL
mutation {
  deleteUser(id: "0113b1db-f787-48bf-93e3-ff0a254c7e45") {
    firstName
    lastName
  }
}
```
The `JSON` output is the deleted user record.

# Project structure

This project is based on NextJS framework and follows its general structure guidelines. The API functionality is a `Module` of the NextJS application, so it can be modified without touching other parts of the application or copied and injected into another NextJS application relatively easy.

## Files

```
📂src/
  main - NestJS app bootstrap file
  app.module - NestJS app main module that imports UserModule

  📂user/ - API module directory
    user.module - main UserModule file with Apollo GraphQL import and configuration

    📂graphql/ - everything GraphQL
      user.schema - GraphQL schema file
      user.resolver - NestJS service with GraphQL resolvers that map data layer methods and outputs to API calls
      user.graqhql.typings - auto-generated types file
      user.generate.typings - script for manual generation of types
      user.custom.scalars - code for custom data types used by GraphQL

    📂prisma/ - data access layer based on Prisma ORM
      schema - Prisma schema file
      user.prisma.client - Prisma client init code
      user.prismal.service - NestJS service with data access methods that are called by GraphQL resolvers

      📂migrations/ - Prisma database migrations directory

    📂helpers/
      user.helpers.service - NestJS service with helper functions like Prisma filter object builder
    
    📂test/ - test files and mocks

    .env - environment variables
```

## Schema-first approach

The API module is based on schema-first approach, i.e., GraphQL schema is the primary source of truth for the `User` application (for more information on this approach refer to the Schema first sections in [NestJS documentation on integrating GraphQL](https://docs.nestjs.com/graphql/quick-start)). 

The schema translates to TypeScript types used throughout the application (`user.graphql.typings` file) that are generated automatically on start-up. However, for development purposes it might be necessary to generate the types after making changes to the schema to make them available in the IDE and prevent compilation errors. To generate types manually based on edited GraphQL schema run `npm run genTypes` script.

## Validation

Following the schema-first approach, validation is handled by the GraphQL layer that monitors inputs and outputs and checks if they conform to schema types. On any mismatch the code throws an error available in the response to the HTTP request. 

Out-of-the-box GraphQL types do not cover everything, so custom scalar types were introduced to cover date and email strings (`DateISO` and `Email` types, `user.custom.scalars` file).

# Tech stack

TypeScript, [NestJS](https://nestjs.com/) as a back-end framework, GraphQL ([Apollo](https://www.apollographql.com/) implementation) for quering the API, [Prisma](https://www.prisma.io/) ORM for working with a [PostgreSQL](https://www.postgresql.org/) relational database. 