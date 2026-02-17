// libs/training-program/workout.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { Message } from '../../libs/enums/common.enum';
import { Workout } from '../../libs/dto/trainingProgram/program';
import { WorkoutInput } from '../../libs/dto/trainingProgram/program.input';

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
}
