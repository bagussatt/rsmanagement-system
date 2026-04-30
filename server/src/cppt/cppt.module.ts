import { Module } from '@nestjs/common';
import { CpptController } from './cppt.controller';
import { CpptService } from './cppt.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [CpptController],
  providers: [CpptService, PrismaService],
  exports: [CpptService],
})
export class CpptModule {}