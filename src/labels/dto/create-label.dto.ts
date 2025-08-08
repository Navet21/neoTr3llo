import { IsString, IsNotEmpty} from 'class-validator';

export class CreateLabelDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    boardId: string;
}