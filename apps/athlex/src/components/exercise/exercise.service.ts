// libs/training-program/exercise.service.ts

import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Exercise } from '../../libs/dto/trainingProgram/program';
import {
  ExerciseInput,
  ExerciseUpdate,
} from '../../libs/dto/trainingProgram/program.input';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel('Exercise') private exerciseModel: Model<Exercise>,
    @InjectModel('Workout') private workoutModel: Model<any>,
    @InjectModel('Program') private programModel: Model<any>,
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

  public async getExercisesByWorkout(workoutId: string): Promise<Exercise[]> {
    return await this.exerciseModel
      .find({ workoutId })
      .sort({ orderInWorkout: 1 })
      .exec();
  }

  public async updateExercise(
    memberId: ObjectId,
    exerciseId: string,
    input: ExerciseUpdate,
  ): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(exerciseId).exec();
    if (!exercise) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    // Verify ownership through workout -> program -> memberId
    const workout = await this.workoutModel
      .findById(exercise.workoutId)
      .exec();
    if (!workout) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    const program = await this.programModel
      .findOne({ _id: workout.programId, memberId })
      .exec();
    if (!program) {
      throw new ForbiddenException(Message.NOT_ALLOWED);
    }

    const result = await this.exerciseModel
      .findByIdAndUpdate(exerciseId, input, { new: true })
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }
    return result;
  }

  public async deleteExercise(
    memberId: ObjectId,
    exerciseId: string,
  ): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(exerciseId).exec();
    if (!exercise) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    // Verify ownership
    const workout = await this.workoutModel
      .findById(exercise.workoutId)
      .exec();
    if (!workout) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    const program = await this.programModel
      .findOne({ _id: workout.programId, memberId })
      .exec();
    if (!program) {
      throw new ForbiddenException(Message.NOT_ALLOWED);
    }

    // Remove from workout's exercises array
    await this.workoutModel.findByIdAndUpdate(exercise.workoutId, {
      $pull: { exercises: exercise._id },
    });

    const result = await this.exerciseModel
      .findByIdAndDelete(exerciseId)
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.REMOVE_FAILED);
    }
    return result;
  }
}
