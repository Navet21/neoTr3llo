import {IsNotEmpty, IsUUID } from "class-validator";

export class InviteUserToBoardDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    @IsNotEmpty()
    boardId: string;
}
