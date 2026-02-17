// libs/training-program/exercise.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Exercise } from '../../libs/dto/trainingProgram/program';
import { ExerciseInput } from '../../libs/dto/trainingProgram/program.input';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel('Exercise') private exerciseModel: Model<Exercise>,
    @InjectModel('Workout') private workoutModel: Model<any>,
  ) {}

  public async createExercise(
    memberId: ObjectId,
    input: ExerciseInput,
  ): Promise<Exercise> {
    const exercise = await this.exerciseModel.create(input);

    if (!exercise) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    // Add exercise to workout's exercises array
    await this.workoutModel.findByIdAndUpdate(input.workoutId, {
      $push: { exercises: exercise._id },
    });

    return exercise;
  }
}
