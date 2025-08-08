import { IsString, IsNotEmpty, IsEnum, IsUrl } from "class-validator";
import { AttachmentType } from "../enums/attachments-type";

export class CreateAttachmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(AttachmentType)
    @IsNotEmpty()
    type: AttachmentType;

    @IsUrl()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    taskId: string;
}
