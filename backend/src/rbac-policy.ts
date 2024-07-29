import { Role } from '@prisma/client';
import { RolesBuilder } from 'nest-access-control';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

// prettier-ignore
RBAC_POLICY
  .grant(Role.USER)
    // You can add permissions for USER role here if needed in the future
    .readOwn('profile')
    .readAny('tasks')
    .readOwn('tasks')
  .grant(Role.ADMIN)
    .extend(Role.USER)
    .createAny('tasks')
    .updateAny('tasks')
    .deleteAny('tasks')
    .readAny('profile')
    .updateAny('profile')
    .deleteAny('profile')
    .createAny('profile')
