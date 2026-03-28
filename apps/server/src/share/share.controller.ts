import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ShareService } from './share.service'
import { CreateShareDto } from './share.dto'

@ApiTags('share')
@Controller('share')
export class ShareController {
  constructor(private readonly svc: ShareService) {}

  @Post()
  @ApiOperation({ summary: 'Create a shareable canvas snapshot link' })
  create(@Body() dto: CreateShareDto) {
    return this.svc.create(dto)
  }

  @Get(':shareId')
  @ApiOperation({ summary: 'Get shared canvas snapshot by shareId' })
  findOne(@Param('shareId') shareId: string) {
    return this.svc.findByShareId(shareId)
  }

  @Delete(':shareId')
  @ApiOperation({ summary: 'Delete a share by shareId' })
  async remove(@Param('shareId') shareId: string) {
    await this.svc.delete(shareId)
    return { success: true }
  }
}
