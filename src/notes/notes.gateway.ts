import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotesService } from './notes.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class NotesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notesService: NotesService) { }

  handleConnection(client: Socket) {
    console.log('Cliente conectado:', client.id);
    client.emit('connected', { message: 'Conectado al servidor de notas ✅' });
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id);
  }

  @SubscribeMessage('notes:getAll')
  async handleGetAll(@ConnectedSocket() client: Socket) {
    const notes = await this.notesService.findAll();
    client.emit('notes:list', notes);
  }

  @SubscribeMessage('notes:getAllTags')
  async handleGetAllTags(@ConnectedSocket() client: Socket) {
    const tags = await this.notesService.getTags();
    client.emit('tags:list', tags);
  }

  @SubscribeMessage('notes:getOne')
  async handleGetOne(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    const note = await this.notesService.findOne(id);
    client.emit('notes:one', note);
  }

  @SubscribeMessage('notes:create')
  async handleCreate(@MessageBody() body: { title: string; content: string; createdById: string; tags?: string[] }) {
    const newNote = await this.notesService.create(body);
    this.server.emit('notes:created', newNote);
    
    const notes = await this.notesService.findAll();
    this.server.emit('notes:list', notes);
    
    const tags = await this.notesService.getTags();
    this.server.emit('tags:list', tags);
  }

  @SubscribeMessage('notes:update')
  async handleUpdate(@MessageBody() body: { id: number; title?: string; content?: string; updatedById: string; tags?: string[] }) {
    const updatedNote = await this.notesService.update(body.id, body);
    this.server.emit('notes:updated', updatedNote);
  }

  @SubscribeMessage('notes:remove')
  async handleRemove(@MessageBody() id: number) {
    await this.notesService.remove(id);
    this.server.emit('notes:removed', id);
  }

  @SubscribeMessage('notes:archive')
  async handleArchive(@MessageBody() id: number) {
    const archived = await this.notesService.archive(id);
    this.server.emit('notes:archived', archived);
  }

}
