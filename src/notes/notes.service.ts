import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.note.findMany({
      where: { archived: false },
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    if (!note) throw new NotFoundException(`Note ${id} not found`);
    return note;
  }

  async create(data: { title: string; content: string; createdById: string; tags?: string[] }) {
    return this.prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        createdById: data.createdById,
        tags: data.tags
          ? {
              create: data.tags.map((name) => ({
                tag: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  async update(id: number, data: { title?: string; content?: string; updatedById: string; tags?: string[] }) {
    return this.prisma.note.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        updatedById: data.updatedById,
        tags: data.tags
          ? {
              deleteMany: {}, // limpia las tags actuales
              create: data.tags.map((name) => ({
                tag: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  async remove(id: number) {
    return this.prisma.note.delete({ where: { id } });
  }

  async archive(id: number) {
    return this.prisma.note.update({
      where: { id },
      data: { archived: true },
    });
  }
  
  async getTags(){
    return this.prisma.tag.findMany()
  }
}
