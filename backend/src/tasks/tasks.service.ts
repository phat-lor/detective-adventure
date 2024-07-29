import { Injectable, NotFoundException } from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';
import { TaskDto } from './dto/task.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from 'src/users/dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  getAllTasks(page: number, perPage: number) {
    const paginate = createPaginator({ perPage });

    return paginate<TaskDto, Prisma.TaskFindManyArgs>(
      this.prisma.task,
      {
        where: {},
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
          title: true,
          description: true,
          locations: {
            select: {
              placeName: true,
              latitude: true,
              longitude: true,
            },
          },
        },
      },
      {
        page,
      },
    );
  }
  createTask(data: TaskDto) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        locations: {
          create: data.locations,
        },
      },
    });
  }

  async getTaskById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        locations: {
          select: {
            placeName: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(id: string, data: UpdateTaskDto) {
    const prevTask = await this.prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        locations: {
          select: {
            placeName: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!prevTask) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        locations: {
          create: data.locations,
        },
      },
    });
  }

  async deleteTask(id: string) {
    const del = await this.prisma.task.delete({
      where: {
        id,
      },
    });

    return del;
  }
}
