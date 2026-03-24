import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Canvas, CanvasMongoSchema } from './canvas.schema'
import { CanvasController } from './canvas.controller'
import { CanvasService } from './canvas.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Canvas.name, schema: CanvasMongoSchema }])],
  controllers: [CanvasController],
  providers: [CanvasService],
  exports: [CanvasService],
})
export class CanvasModule {}
