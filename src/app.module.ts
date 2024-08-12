import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { SignUpController } from './controllers/signup.controller'
import { envSchema } from './env'

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: (env) => envSchema.parse(env),
            isGlobal: true,
        }),
    ],
    controllers: [SignUpController],
    providers: [PrismaService],
})
export class AppModule {}
