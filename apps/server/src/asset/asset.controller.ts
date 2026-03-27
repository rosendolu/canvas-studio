import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
  UploadedFile, UseInterceptors, Res, StreamableFile, BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { createReadStream } from 'fs'
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { AssetService } from './asset.service'
import { UpdateAssetDto, ListAssetsDto } from './asset.dto'

@ApiTags('assets')
@Controller('assets')
export class AssetController {
  constructor(private readonly svc: AssetService) {}

  @Get()
  @ApiOperation({ summary: 'List assets with optional type/tags/search filter' })
  list(@Query() query: ListAssetsDto) {
    return this.svc.list(query)
  }

  @Get('file/:storageKey(*)')
  @ApiOperation({ summary: 'Serve asset binary by storageKey' })
  async serveFile(
    @Param('storageKey') storageKey: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    // Validate storageKey is a basename-only identifier (no path separators)
    if (!storageKey || storageKey.includes('/') || storageKey.includes('..') || storageKey.includes('\\')) {
      throw new BadRequestException('Invalid storageKey')
    }
    const absPath = this.svc.storageAbsPath(storageKey)
    const stream = createReadStream(absPath)
    return new StreamableFile(stream)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset metadata by id' })
  findOne(@Param('id') id: string) {
    return this.svc.findById(id)
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a new asset (multipart/form-data)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('assetType') assetType: string,
    @Body('name') name?: string,
    @Body('tags') rawTags?: string,
  ) {
    if (!file) throw new BadRequestException('File is required')
    if (!assetType) throw new BadRequestException('assetType is required')
    const tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : []
    return this.svc.upload(file.buffer, file.originalname, file.mimetype, assetType, name, tags)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update asset metadata (name/tags)' })
  update(@Param('id') id: string, @Body() dto: UpdateAssetDto) {
    return this.svc.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete asset and its stored file' })
  async remove(@Param('id') id: string) {
    await this.svc.delete(id)
    return { success: true }
  }
}
