import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { HashService } from 'src/common/hash.service';
import { PrismaService } from 'src/common/prisma.service';
import { RegisterDto } from './dto/register.dto';

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

    return {
      access_token: await this.jwtService.signAsync(
        await this.createPayload(user),
      ),
    };
  }

  async refresh(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    return {
      access_token: await this.jwtService.signAsync(
        await this.createPayload(user),
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

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          { sip: dto.sip ? dto.sip : undefined },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username atau SIP sudah terdaftar');
    }

    // Menggunakan HashService agar konsisten dengan signIn
    const hashedPassword = await this.hash.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async getUsersByRole(role?: string) {
    const where = role ? { role: role as any } : {};

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        specialization: true,
        sip: true,
        phone: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}