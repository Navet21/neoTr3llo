import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBoardUserDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    boardId: string;

    @IsBoolean()
    @IsOptional()
    isOwner?: boolean;
}
