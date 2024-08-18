import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('CreateQuestionController (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[POST] /questions', async () => {
        const password = await hash('123456', 8)

        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password,
            },
        })

        const accessToken = jwt.sign({ sub: user.id, role: user.role })

        const response = await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: 'New question',
                content: 'Question content',
            })

        expect(response.statusCode).toBe(201)

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'New question',
            },
        })

        expect(questionOnDatabase).toBeTruthy()
    })
})
