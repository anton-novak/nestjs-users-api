import { Injectable } from '@nestjs/common';
import { User as UserGQL, UserListFilters } from '../graphql/user.graphql.schema';
import { User as UserPrisma } from "@prisma/client";
import { error } from 'console';

@Injectable()
export class UserHelpersService {

  prismaFilterBuilder(filters: UserListFilters) {
    // AND array included for future extensions.
    let prismaFilter = {
        AND: []
    };

    // Period filter.
    if (filters.createdAtFilter) {

      if (filters.createdAtFilter.after) {
        let after = new Date(filters.createdAtFilter.after);
        prismaFilter.AND.push({
          createdAt: {
            gte: after
          }
        });
      }

      if (filters.createdAtFilter.before) {
        let before = new Date(filters.createdAtFilter.before);
        prismaFilter.AND.push({
          createdAt: {
            lte: before
          }
        });
      }
    }

    return prismaFilter;
  }

}