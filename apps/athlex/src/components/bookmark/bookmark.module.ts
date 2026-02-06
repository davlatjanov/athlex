// components/bookmark/bookmark.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookmarkResolver } from './bookmark.resolver';
import { BookmarkService } from './bookmark.service';
import BookmarkSchema from '../../schemas/Bookmark.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Bookmark',
        schema: BookmarkSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [BookmarkResolver, BookmarkService],
  exports: [BookmarkService],
})
export class BookmarkModule {}
