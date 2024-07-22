import { Role } from '@prisma/client';

export interface RoleMetadata {
  name: string;
  priority: number;
}

export const roleMetadata: Record<Role, RoleMetadata> = {
  [Role.USER]: {
    name: 'Free',
    priority: 1,
  },

  [Role.ADMIN]: {
    name: 'Admin',
    priority: 4,
  },
};
