import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserDto } from './dto';
import { Prisma, Role } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { AuthenticationService } from 'src/auth/auth.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { roleMetadata } from 'src/auth/enums';
import { el } from '@faker-js/faker';
import { TaskDto } from 'src/tasks/dto/task.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthenticationService,
  ) {}

  getUserInfo(id: string) {
    const user = this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        phoneNumber: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { ...user };
  }

  async getUserInfoById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        phoneNumber: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, body: UpdateUserDto, curUserRole: Role) {
    const { phoneNumber, password, role, username } = body;

    if (role) this.checkRolePriority(curUserRole, role);

    const userData: any = {
      phoneNumber,
      role,
      username,
    };

    if (password) {
      userData.password = await this.authService.hashShortData(password);
    }

    const updatedData = await this.prisma.user.update({
      where: { id },
      data: userData,
    });

    if (!updatedData) {
      throw new NotFoundException('User not found');
    }

    return updatedData;
  }

  async deleteUser(id: string, curUsrRole: Role) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const delUsrRole = user.role as Role;

    this.checkRolePriority(curUsrRole, delUsrRole);

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return user;
  }

  getAllUsers(page: number, perPage: number) {
    const paginate = createPaginator({ perPage });

    return paginate<UserDto, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        where: {},
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
          phoneNumber: true,
          username: true,
          role: true,
          createdAt: true,
        },
      },
      {
        page,
      },
    );
  }

  async createUser(data: UserDto, curUserRole: Role) {
    const { phoneNumber, username, password, role } = data;
    if (!phoneNumber || !username || !password) {
      throw new BadRequestException('Missing fields');
    }

    this.checkRolePriority(curUserRole, role);

    const hashpw = await this.authService.hashShortData(password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          phoneNumber,
          username,
          password: hashpw,
          role: role,
        },
      });
      return newUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Username or phoneNumber already exists',
          );
        }
      }
    }
  }

  async getUserTasks(userId: string, page: number, perPage: number) {
    const activatedTasks = await this.prisma.userTask.findMany({
      where: {
        userId,
      },
      select: {
        taskId: true,
        clearedLocations: true,
      },
    });

    const paginate = createPaginator({ perPage });
    let tasks = await paginate<TaskDto, Prisma.TaskFindManyArgs>(
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
              id: true,
              placeName: true,
              thumbnails: true,
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

    // if the tasks is in the array of activatedTasks then inject the activated property
    tasks.data = tasks.data.map((task) => {
      // @ts-ignore
      // activatedTasks includes the task id
      let activatedTask = activatedTasks.find(
        // @ts-ignore

        (t) => t.taskId === task.id,
      );

      if (!activatedTask) {
        return { ...task, status: 'NOT_STARTED' };
      }

      task.locations = task.locations.map((location) => {
        // @ts-ignore
        let clearedLocation = activatedTask.clearedLocations.find(
          // @ts-ignore
          (cl) => cl.taskLocationId === location.id,
        );
        return { ...location, cleared: !!clearedLocation };
      });

      return task;
    });
    return tasks;
  }

  async startUserTaskById(userId: string, id: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // check if already started
    const userTaskExists = await this.prisma.userTask.findFirst({
      where: {
        userId,
        taskId: id,
      },
    });

    if (userTaskExists) {
      throw new BadRequestException('Task already started');
    }

    const userTask = await this.prisma.userTask.create({
      data: {
        task: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return userTask;
  }

  async getUserTaskById(userId: string, taskId: string) {
    const activatedTask = await this.prisma.userTask.findFirst({
      where: {
        userId,
        taskId,
      },
      include: {
        clearedLocations: true,
        task: {
          include: {
            locations: true,
          },
        },
      },
    });

    console.log(activatedTask);

    if (!activatedTask) {
      throw new NotFoundException('Task not found');
    }
    return activatedTask;
  }

  async clearLocation(userId: string, taskId: string, locationId: string) {
    const activatedTask = await this.prisma.userTask.findFirst({
      where: {
        userId,
        taskId,
      },
    });

    if (!activatedTask) {
      throw new NotFoundException('Task not found');
    }

    const taskLocation = await this.prisma.taskLocation.findUnique({
      where: {
        id: locationId,
      },
    });

    if (!taskLocation) {
      throw new NotFoundException('Location not found');
    }

    // check if location is already cleared
    const clearedLocationExists = await this.prisma.clearedLocation.findFirst({
      where: {
        taskLocationId: locationId,
        userTaskId: activatedTask.id,
      },
    });

    if (clearedLocationExists) {
      throw new BadRequestException('Location already cleared');
    }

    const clearedLocation = await this.prisma.clearedLocation.create({
      data: {
        taskLocation: {
          connect: {
            id: locationId,
          },
        },
        userTask: {
          connect: {
            id: activatedTask.id,
          },
        },
      },
    });

    return clearedLocation;
  }

  checkRolePriority(userRole: Role, requiredRole: Role) {
    if (!userRole || !requiredRole) {
      throw new BadRequestException('Role not provided');
    }
    const userRolePriority = roleMetadata[userRole].priority;
    const requiredRolePriority = roleMetadata[requiredRole].priority;

    if (userRolePriority <= requiredRolePriority) {
      throw new ForbiddenException(
        'You only have permission to modify users with a lower role',
      );
    }
  }
}
