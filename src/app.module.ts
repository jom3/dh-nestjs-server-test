import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule, NotesModule, TagsModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
