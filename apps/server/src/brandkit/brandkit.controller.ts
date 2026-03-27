import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { BrandKitService } from './brandkit.service'
import { CreateBrandKitDto, UpdateBrandKitDto } from './brandkit.dto'

@ApiTags('brand-kits')
@Controller('api/brand-kits')
export class BrandKitController {
  constructor(private readonly svc: BrandKitService) {}

  @Get()
  @ApiOperation({ summary: 'List all brand kits' })
  list() { return this.svc.list() }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand kit by id' })
  findOne(@Param('id') id: string) { return this.svc.findById(id) }

  @Post()
  @ApiOperation({ summary: 'Create a brand kit' })
  create(@Body() dto: CreateBrandKitDto) { return this.svc.create(dto) }

  @Put(':id')
  @ApiOperation({ summary: 'Update a brand kit' })
  update(@Param('id') id: string, @Body() dto: UpdateBrandKitDto) { return this.svc.update(id, dto) }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a brand kit' })
  duplicate(@Param('id') id: string) { return this.svc.duplicate(id) }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a brand kit' })
  async remove(@Param('id') id: string) {
    await this.svc.delete(id)
    return { success: true }
  }
}
