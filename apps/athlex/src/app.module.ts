import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 60000,
      },
      {
        name: 'ai',
        ttl: 60000,
        limit: 10,
      },
    ]),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      uploads: false,
      autoSchemaFile: true,
      context: ({ req, res, connection }) => {
        // For subscriptions, connection context is used instead of req/res
        if (connection) {
          return {
            req: connection.context?.req || connection.context,
            res: connection.context?.res,
          };
        }
        // For regular queries/mutations, use req/res
        return { req, res };
      },
      formatError: (error: T) => {
        const graphQLFormattedError = {
          code: error?.extensions?.code,
          message:
            error?.extensions?.exception?.response?.message ||
            error?.extensions?.response?.message ||
            error?.message,
        };
        return graphQLFormattedError;
      },
    }),
    ComponentsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
  ],
})
export class AppModule {}
