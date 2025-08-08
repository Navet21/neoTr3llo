import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    @IsOptional()
    isBlocked?: boolean;

    @IsString()
    @IsNotEmpty()
    listId: string;
}