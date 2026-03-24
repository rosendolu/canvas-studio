import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ProjectService } from './project.service'
import { CreateProjectDto, UpdateProjectDto } from './project.dto'

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: '创建项目' })
  create(@Body() dto: CreateProjectDto) { return this.projectService.create(dto) }

  @Get()
  @ApiOperation({ summary: '获取所有项目' })
  findAll() { return this.projectService.findAll() }

  @Get(':id')
  @ApiOperation({ summary: '获取单个项目' })
  findOne(@Param('id') id: string) { return this.projectService.findOne(id) }

  @Patch(':id')
  @ApiOperation({ summary: '更新项目' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除项目' })
  remove(@Param('id') id: string) { return this.projectService.remove(id) }
}
