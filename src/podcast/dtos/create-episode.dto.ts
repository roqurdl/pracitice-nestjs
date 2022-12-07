import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEpisodeDto {
  @Field((type) => String)
  title: string;
  @Field((type) => String)
  category: string;
}
