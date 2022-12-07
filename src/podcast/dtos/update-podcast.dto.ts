import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePodcastDto } from './create-podcast.dto';

@InputType()
export class UpdatePodcastDto extends PartialType(CreatePodcastDto) {}
