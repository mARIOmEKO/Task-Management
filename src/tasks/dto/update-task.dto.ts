import { IsOptional } from "class-validator";
import { TaskStatus } from "../task.entity";

export class UpdateTaskDto{
    @IsOptional()
    title?: string;
    @IsOptional()
    description?: string;
    @IsOptional()
    status?: TaskStatus;
}