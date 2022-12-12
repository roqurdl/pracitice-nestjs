import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { PodcastSearchInput } from './input.dto';
@InputType()
export class CreateEpisodeDto extends PodcastSearchInput {
  @Field((_) => String)
  @IsString()
  readonly title: string;

  @Field((_) => String)
  @IsString()
  readonly category: string;
}
