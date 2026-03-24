import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Project, ProjectMongoSchema } from './project.schema'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectMongoSchema }])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
