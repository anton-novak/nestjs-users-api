// For standalone testing of the Prisma layer.
import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserPrismaService } from "./prisma/user.prisma.service";
// import { User } from "./interfaces/user.interface";

@Controller('user')
export class UserController {
  constructor(private userService: UserPrismaService) {}

  @Get('users')
  async listUsers(): Promise<any[]> {
    return this.userService.listUsers();
  }

  @Post()
  async createUser(@Body() data: any): Promise<any> {
    return this.userService.createUser(data);
  }
}