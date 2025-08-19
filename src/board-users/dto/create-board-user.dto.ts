import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBoardUserDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    @IsNotEmpty()
    boardId: string;

    @IsBoolean()
    @IsOptional()
    isOwner?: boolean;
}
