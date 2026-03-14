// libs/training-program/workout.service.ts

import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { Message } from '../../libs/enums/common.enum';
import { Workout } from '../../libs/dto/trainingProgram/program';
import {
  WorkoutInput,
  WorkoutUpdate,
} from '../../libs/dto/trainingProgram/program.input';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectModel('Workout') private workoutModel: Model<Workout>,
    @InjectModel('Program') private programModel: Model<any>,
  ) {}

  public async createWorkout(
    memberId: ObjectId,
    input: WorkoutInput,
  ): Promise<Workout> {
    // Verify program exists and belongs to trainer
    const program = await this.programModel
      .findOne({ _id: input.programId, memberId })
      .exec();

    if (!program) {
      throw new InternalServerErrorException('Program not found');
    }

    const workout = await this.workoutModel.create(input);

    if (!workout) {
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }

    // Add workout to program's workouts array
    await this.programModel.findByIdAndUpdate(input.programId, {
      $push: { workouts: workout._id },
    });

    return workout;
  }

  public async getWorkoutsByProgram(programId: string): Promise<Workout[]> {
    return await this.workoutModel
      .find({ programId })
      .sort({ workoutDay: 1 })
      .populate('exercises')
      .exec();
  }

  public async updateWorkout(
    memberId: ObjectId,
    workoutId: string,
    input: WorkoutUpdate,
  ): Promise<Workout> {
    // Verify the workout exists
    const workout = await this.workoutModel.findById(workoutId).exec();
    if (!workout) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    // Verify the program belongs to this trainer
    const program = await this.programModel
      .findOne({ _id: workout.programId, memberId })
      .exec();
    if (!program) {
      throw new ForbiddenException(Message.NOT_ALLOWED);
    }

    const result = await this.workoutModel
      .findByIdAndUpdate(workoutId, input, { new: true })
      .populate('exercises')
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.UPDATE_FAILED);
    }
    return result;
  }

  public async deleteWorkout(
    memberId: ObjectId,
    workoutId: string,
  ): Promise<Workout> {
    const workout = await this.workoutModel.findById(workoutId).exec();
    if (!workout) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    // Verify the program belongs to this trainer
    const program = await this.programModel
      .findOne({ _id: workout.programId, memberId })
      .exec();
    if (!program) {
      throw new ForbiddenException(Message.NOT_ALLOWED);
    }

    // Remove workout from program's workouts array
    await this.programModel.findByIdAndUpdate(workout.programId, {
      $pull: { workouts: workout._id },
    });

    const result = await this.workoutModel
      .findByIdAndDelete(workoutId)
      .exec();

    if (!result) {
      throw new InternalServerErrorException(Message.REMOVE_FAILED);
    }
    return result;
  }
}
