import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { SignUpController } from './controllers/signup.controller'

@Module({
    controllers: [SignUpController],
    providers: [PrismaService],
})
export class AppModule {}
