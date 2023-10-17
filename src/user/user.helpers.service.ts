import { Injectable } from '@nestjs/common';
import { User as UserGQL } from './graphql/user.graphql.schema';
import { User as UserPrisma } from "@prisma/client";

@Injectable()
export class UserHelpersService {

  // TO DO: check again if this is necessary.
  dateToString(userRecord: UserPrisma): UserGQL {
    let target = {} as UserGQL;
    Object.assign(target, userRecord);
    target.createdAt = userRecord.createdAt.toISOString();
    userRecord.updatedAt ? target.updatedAt = userRecord.updatedAt.toISOString() : null;
    return target;
  }

}