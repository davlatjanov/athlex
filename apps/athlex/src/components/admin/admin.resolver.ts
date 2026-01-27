import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Member } from '../../libs/dto/member/member';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => String)
  public async getAllMembersByAdmin(): Promise<string> {
    console.log('Query getAllMembersByAdmin');
    return await this.adminService.getAllMembersByAdmin();
  }

  @Mutation(() => String)
  public async updateMembersByAdmin(): Promise<string> {
    console.log('Mutation updateMemberByAdmin');
    return await this.adminService.updateMembersByAdmin();
  }
}
