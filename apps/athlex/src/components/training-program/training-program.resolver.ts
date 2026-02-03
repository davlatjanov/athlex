import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TrainingProgramService } from './training-program.service';

@Resolver()
export class TrainingProgramResolver {
  constructor(private readonly programSerivice: TrainingProgramService) {}
}
