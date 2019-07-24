import { IsNumber } from 'class-validator';

export class RemoveRoleDto {
  @IsNumber()
  roleToRemoveId: number;

  @IsNumber()
  roleToReplaceId: number;
}
