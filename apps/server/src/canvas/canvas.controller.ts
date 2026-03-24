import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body, Query
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { CanvasService } from './canvas.service'
import { CreateCanvasDto, UpdateCanvasDto } from './canvas.dto'

@ApiTags('Canvas')
@Controller('canvas')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @Post()
  @ApiOperation({ summary: '创建画布' })
  create(@Body() dto: CreateCanvasDto) {
    return this.canvasService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: '获取画布列表' })
  @ApiQuery({ name: 'mode', required: false, enum: ['live', 'editor'] })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'isPublic', required: false, type: Boolean })
  findAll(
    @Query('mode') mode?: string,
    @Query('projectId') projectId?: string,
    @Query('isPublic') isPublic?: string,
  ) {
    return this.canvasService.findAll({
      mode,
      projectId,
      isPublic: isPublic !== undefined ? isPublic === 'true' : undefined,
    })
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个画布（含完整 pages/track 数据）' })
  findOne(@Param('id') id: string) {
    return this.canvasService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新画布基本信息' })
  update(@Param('id') id: string, @Body() dto: UpdateCanvasDto) {
    return this.canvasService.update(id, dto)
  }

  @Put(':id/pages')
  @ApiOperation({ summary: '保存直播间 pages 状态（全量）' })
  savePages(@Param('id') id: string, @Body() body: { pages: any[] }) {
    return this.canvasService.savePages(id, body.pages)
  }

  @Put(':id/track')
  @ApiOperation({ summary: '保存视频编辑器 track 状态（全量）' })
  saveTrack(@Param('id') id: string, @Body() body: { track: any[] }) {
    return this.canvasService.saveTrack(id, body.track)
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: '复制画布' })
  duplicate(@Param('id') id: string) {
    return this.canvasService.duplicate(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除画布' })
  remove(@Param('id') id: string) {
    return this.canvasService.remove(id)
  }
}
