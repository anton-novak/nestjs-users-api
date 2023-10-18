// For standalone testing of the Prisma layer.
import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserPrismaService } from "./prisma/user.prisma.service";

@Controller('user')
export class UserController {
  constructor(private userService: UserPrismaService) {}

  @Get('users')
  async listUsers(): Promise<any[]> {
    return this.userService.listUsers({} as any);
  }

  @Post()
  async createUser(@Body() data: any): Promise<any> {
    return this.userService.createUser(data);
  }
}