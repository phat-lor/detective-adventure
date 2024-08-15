import { Injectable, NotFoundException } from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';
import { TaskDto } from './dto/task.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from 'src/users/dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QrCodeService } from './qrcode/qrcode.service';
import { Response } from 'express';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private qrcode: QrCodeService,
  ) {}
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
          thumbnails: true,
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
        thumbnails: data.thumbnails,
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

  async getTaskQRById(id: string, baseUrl: String, locationIndex: number) {
    const userTask = await this.prisma.userTask.findFirst({
      where: {
        taskId: id,
      },
      include: {
        task: {
          include: {
            locations: true,
          },
        },
      },
    });
    if (!userTask) {
      throw new NotFoundException('User task not found');
    }

    const data = `${baseUrl}/app?taskId=${id}&locationId=${userTask.task.locations[locationIndex].id}&qr=true&placeId=${userTask.task.id}`;
    const qrCodeDataURL = await this.qrcode.generateQrCode(data);

    return {
      imageUrl: qrCodeDataURL,
    };
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
        thumbnails: data.thumbnails,
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
