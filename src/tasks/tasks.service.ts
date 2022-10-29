import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { GetTasksFilterDto } from './dto/search-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ){}


    async getAllTasks(filter : GetTasksFilterDto, user: User) : Promise<Task[]>{
        const {status, search} = filter;
        const query = await this.taskRepository.createQueryBuilder('t')
        query.where('t.userId = :userId', {userId: user.id})
        if(status){
            query.andWhere('t.status = :status', {status});
        }
        if(search){
            query.andWhere('(t.title LIKE :search OR t.description LIKE :search)', {search: `%${search}%`});
        }
        return query.getMany();
    }

    async createTask(createTaskDto : CreateTaskDto, user: User) : Promise<Task>{

        const  task = new Task()
        task.title = createTaskDto.title;
        task.description = createTaskDto.description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await this.taskRepository.save(task)
        return task;

    }

    async getTaskById(id: number, user: User) : Promise<Task> {
        const task= await this.taskRepository.findOne({where: {id:id, userId: user.id}});
        if(!task){
            throw new NotFoundException('Task not found')
        }
        return task;

    }

    async updateTask(id:number, status : TaskStatus,user:User): Promise<Task>{
        const task = await this.taskRepository.findOne({where:{id:id, userId:user.id}});
        if(!task){
            throw new NotFoundException('Task not found')
        }
        task.status = status;
        await task.save();
        return task;
        
    }

    async deleteTask(id: number,user: User): Promise<DeleteResult> {

        const result= await this.taskRepository.delete({id, userId: user.id});
        if(result.affected == 0){
            throw new NotFoundException('Task not found')
        }
        return;
    }
}
