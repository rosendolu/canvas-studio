import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
} from '@nestjs/common'
import { TemplateService } from './template.service'
import { CreateTemplateDto, UpdateTemplateDto, ListTemplatesDto } from './template.dto'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('templates')
@Controller('api/templates')
export class TemplateController {
  constructor(private readonly svc: TemplateService) {}

  @Get()
  @ApiOperation({ summary: 'List templates with optional type/tags/search filter' })
  list(@Query() query: ListTemplatesDto) {
    return this.svc.list(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by id' })
  findOne(@Param('id') id: string) {
    return this.svc.findById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new template' })
  create(@Body() dto: CreateTemplateDto) {
    return this.svc.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update template metadata/payload' })
  update(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return this.svc.update(id, dto)
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a template' })
  duplicate(@Param('id') id: string) {
    return this.svc.duplicate(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a template' })
  async remove(@Param('id') id: string) {
    await this.svc.delete(id)
    return { success: true }
  }
}
