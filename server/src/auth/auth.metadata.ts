import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLE_KEY = 'roles';
export const SetRoles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);

export const IsAdmin = () => SetRoles(Role.ADMIN);
