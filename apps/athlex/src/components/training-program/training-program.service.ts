import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';
import { Program } from '../../libs/dto/trainingProgram/program';

@Injectable()
export class TrainingProgramService {
  constructor(
    @InjectModel('Program') private memberModel: Model<Program>,
    private readonly authService: AuthService,
    private readonly viewService: ViewService,
  ) {}
}
