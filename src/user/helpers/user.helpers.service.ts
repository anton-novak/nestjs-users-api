import { Injectable } from '@nestjs/common';
import { User as UserGQL, UserListFilters } from '../graphql/user.graphql.schema';
import { User as UserPrisma } from "@prisma/client";
import { error } from 'console';

@Injectable()
export class UserHelpersService {

  prismaFilterBuilder(filters: UserListFilters) {
    // AND array included for future extensions.
    let prismaFilter = {
      where: {
        AND: []
      }
    };

    // Period filter.
    if (filters.createdAtFilter) {

      if (filters.createdAtFilter.after) {
        let after = new Date(filters.createdAtFilter.after);
        // TODO: Research custom GraphQL scalar types as another approach 
        // to validating dates and abstract this logic to the schema level.
        if (after.toString() === 'Invalid Date') throw new Error('Invalid date format.');
        prismaFilter.where.AND.push({
          createdAt: {
            gte: after
          }
        });
      }

      if (filters.createdAtFilter.before) {
        let before = new Date(filters.createdAtFilter.before);
        if (before.toString() === 'Invalid Date') throw new Error('Invalid date format.');
        prismaFilter.where.AND.push({
          createdAt: {
            lte: before
          }
        });
      }
    }

    return prismaFilter;
  }

}