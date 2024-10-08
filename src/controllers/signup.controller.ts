import {
    Body,
    Controller,
    HttpCode,
    Post,
    ConflictException,
    UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/signup')
export class SignUpController {
    constructor(private readonly prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreateAccountBodySchema) {
        const { name, email, password } = body

        const userExistent = await this.prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (userExistent) {
            throw new ConflictException(
                'User with same e-mail address already exists.'
            )
        }

        const hashedPassword = await hash(password, 12)

        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })
    }
}
