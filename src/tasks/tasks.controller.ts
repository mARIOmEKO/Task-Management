import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/search-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(
        private readonly tasksService: TasksService
    ){}

    @Get()
    getAllTasks(
        @Query() filter: GetTasksFilterDto,
        @GetUser() user:User,
        ) {
        return this.tasksService.getAllTasks(filter, user);
    }

    @Post()
    createTask(
        @Body() input: CreateTaskDto,
        @GetUser() user: User) : Promise<Task>{
        return this.tasksService.createTask(input, user);
    }

    @Get(':id')
    getTaskById(
        @Param('id', ParseIntPipe) id:number,
        @GetUser() user: User){
        return this.tasksService.getTaskById(id, user)
    }

    @Patch(':id')
    updateTask(
        @Param('id', ParseIntPipe) id:number, 
        @Body('status') status: TaskStatus,
        @GetUser() user:User ){

        return this.tasksService.updateTask(id, status,user)
    }

    @Delete(':id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user:User)
        {

        return this.tasksService.deleteTask(id,user);


    }
}
