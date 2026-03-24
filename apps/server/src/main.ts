import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.enableCors({ origin: '*' })
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Canvas Studio API')
    .setDescription('Canvas Studio 后端 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 Server running on http://localhost:${port}`)
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`)
}
bootstrap()
