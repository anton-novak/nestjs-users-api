import { User } from "@prisma/client";
import { UserResolver } from "../graphql/user.resolver";
import { UserHelpersService } from "../helpers/user.helpers.service";
import * as fs from 'fs';
import * as path from 'path';
import { UserCreateInput, UserUpdateInput } from "../graphql/user.graphql.schema";

describe('User resolvers', () => {
  let mockPrismaService: any;
  let userResolver: UserResolver;
  let mockUsers: User[];

  class MockPrismaService {
    constructor() { }

    createUser = jest.fn((args: UserCreateInput) => {
      return new Promise(res => {
        res(mockUsers.find(user => user.email === args.email));
      });
    });

    getUser = jest.fn((id: string) => {
      return new Promise(res => {
        res(mockUsers.find(user => user.id === id));
      });
    });

    // For reasons unknown, the return is in the form of the cursor pagination spec.
    listUsers = jest.fn(() => { return new Promise(res => res(mockUsers)) });

    findLastUser = jest.fn();
    countUserRecords = jest.fn();

    updateUser = jest.fn((args: UserUpdateInput) => {
      return new Promise(res => {
        let user = mockUsers.find(user => user.id === args.id);
        Object.assign(user!, args);
        res(user);
      });
    });

    deleteUser = jest.fn((id: string) => { 
      return new Promise(res => {
        res(mockUsers.find(user => user.id === id));
      });
    });
  };

  beforeEach(async () => {
    mockPrismaService = new MockPrismaService();
    // Injecting the mock Prisma service into the resolver service.
    userResolver = new UserResolver(mockPrismaService, null as unknown as UserHelpersService);
    mockUsers = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mock.users.json'), 'utf8'));
  });

  // Schema-based validation is not picked up by unit tests. 
  // It can be tested by intergration or end-to-end tests.
  it('should create a new user', async () => {
    const res = await userResolver.createUser(mockUsers[3]);
    expect(res).toBe(mockUsers[3]);
    expect(mockPrismaService.createUser).toHaveBeenCalled();
  });
  
  it('should get a user by id', async () => {
    const res = await userResolver.getUser(mockUsers[4].id);
    expect(res).toBe(mockUsers[4]);
    expect(mockPrismaService.getUser).toHaveBeenCalled();
  });

  it('should get a list of users', async () => {
    const res = await userResolver.listUsers() as any;
    expect(JSON.stringify(res.edges.map(el => el.node))).toBe(JSON.stringify(mockUsers));
    expect(mockPrismaService.listUsers).toHaveBeenCalled();
  });

  it('should update a user record', async () => {
    const newUserInput = mockUsers[0];
    newUserInput.firstName = 'Richy';
    const res = await userResolver.updateUser(newUserInput);
    expect(res.firstName).toBe('Richy');
    expect(mockPrismaService.updateUser).toHaveBeenCalled();
  });
  
  it('should delete a user record', async () => {
    const res = await userResolver.deleteUser(mockUsers[5].id);
    expect(res).toBe(mockUsers[5]);
    expect(mockPrismaService.deleteUser).toHaveBeenCalled();
  });

});