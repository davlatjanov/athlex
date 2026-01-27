import { Mutation, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Member } from '../../libs/dto/member/member';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  /*Authorization*/
  @Mutation(() => String)
  public async getAllMembersByAdmin(): Promise<string> {
    console.log('Mutation getAllMembersByAdmin');
    return await this.adminService.getAllMembersByAdmin();
  }

  @Mutation(() => String)
  public async updateMemberByAdmin(): Promise<string> {
    console.log('Mutation updateMemberByAdmin');
    return await this.adminService.updateMemberByAdmin();
  }
}
