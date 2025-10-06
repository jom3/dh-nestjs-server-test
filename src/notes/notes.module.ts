import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesGateway } from './notes.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [NotesGateway, NotesService, PrismaService],
})
export class NotesModule {}
