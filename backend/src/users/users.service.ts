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
