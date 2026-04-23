import { Role } from '@prisma/client';
import { Request } from 'express';

export type ReqUser = Request & {
  user: { sub: string; username: string; role: Role };
};
