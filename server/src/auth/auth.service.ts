import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { HashService } from 'src/common/hash.service';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hash: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException();

    const isValid = await this.hash.comparePasswords(password, user.password);
    if (!isValid) throw new UnauthorizedException();

    const { password: _, ...result } = user;
    return {
      // ...result,
      access_token: await this.jwtService.signAsync(
        await this.createPayload(user),
      ),
    };
  }

  async refresh(userId: string) {
    return {
      access_token: await this.jwtService.signAsync(
        await this.createPayload(
          await this.prisma.user.findUnique({ where: { id: userId } }),
        ),
      ),
    };
  }

  async createPayload(user: User) {
    return {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
