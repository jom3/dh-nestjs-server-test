import { Test, TestingModule } from '@nestjs/testing';
import { NotesGateway } from './notes.gateway';
import { NotesService } from './notes.service';

describe('NotesGateway', () => {
  let gateway: NotesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesGateway, NotesService],
    }).compile();

    gateway = module.get<NotesGateway>(NotesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
