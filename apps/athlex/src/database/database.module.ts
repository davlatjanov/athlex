import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.NODE_ENV === 'production'
            ? process.env.MONGO_PROD
            : process.env.MONGO_DEV,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  onModuleInit() {
    // ✅ immediate state check
    if (this.connection.readyState === 1) {
      console.log(`MongoDB connected ${process.env.NODE_ENV ?? 'development'}`);
    } else {
      console.log('MongoDB not connected yet');
    }

    // ✅ future events
    this.connection.on('connected', () => {
      console.log('MongoDB connected (event)');
    });

    this.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    this.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });
  }
}
