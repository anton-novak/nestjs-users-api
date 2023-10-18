
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class UserCreateInput {
    firstName: string;
    lastName: string;
    email: Email;
}

export class UserUpdateInput {
    id: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    email?: Nullable<Email>;
}

export class UserCreatedAtFilter {
    after?: Nullable<DateISO>;
    before?: Nullable<DateISO>;
}

export class UserListFilters {
    createdAtFilter?: Nullable<UserCreatedAtFilter>;
}

export class User {
    id?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    email?: Nullable<Email>;
    createdAt?: Nullable<DateISO>;
    updatedAt?: Nullable<DateISO>;
}

export abstract class IQuery {
    abstract getUser(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract listUsers(filters?: Nullable<UserListFilters>): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
}

export abstract class IMutation {
    abstract createUser(userCreateInput: UserCreateInput): Nullable<User> | Promise<Nullable<User>>;

    abstract updateUser(userUpdateInput: UserUpdateInput): Nullable<User> | Promise<Nullable<User>>;

    abstract deleteUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export type Email = any;
export type DateISO = any;
type Nullable<T> = T | null;
