import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PodcastsModule } from './podcast/podcast.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot({ driver: ApolloDriver, autoSchemaFile: true }),
    PodcastsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
