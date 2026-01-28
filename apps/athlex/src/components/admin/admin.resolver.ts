import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Member, Members } from '../../libs/dto/member/member';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MembersInquiry } from '../../libs/dto/member/member.input';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Members)
  public async getAllMembersByAdmin(
    @Args('input') input: MembersInquiry,
  ): Promise<Members> {
    console.log('Query: getAllMembersByAdmin');
    return await this.adminService.getAllMembersByAdmin(input);
  }

  @Mutation(() => String)
  public async updateMembersByAdmin(): Promise<string> {
    console.log('Mutation updateMemberByAdmin');
    return await this.adminService.updateMembersByAdmin();
  }
}
