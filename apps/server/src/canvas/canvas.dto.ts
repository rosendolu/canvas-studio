import { IsString, IsOptional, IsBoolean, IsArray, IsIn } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'

export class CreateCanvasDto {
  @ApiProperty({ description: '画布名称', example: '我的直播间' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '模式', enum: ['live', 'editor'], default: 'live' })
  @IsOptional()
  @IsIn(['live', 'editor'])
  mode?: 'live' | 'editor'

  @ApiPropertyOptional({ description: '宽高比', example: '9:16' })
  @IsOptional()
  @IsString()
  aspectRatio?: string

  @ApiPropertyOptional({ description: '背景色', example: '#000000' })
  @IsOptional()
  @IsString()
  bgColor?: string

  @ApiPropertyOptional({ description: '是否公开' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean

  @ApiPropertyOptional({ description: '缩略图 URL' })
  @IsOptional()
  @IsString()
  thumbnail?: string

  @ApiPropertyOptional({ description: '所属项目 ID' })
  @IsOptional()
  @IsString()
  projectId?: string

  @ApiPropertyOptional({ description: '主题色', example: '#00c5a7' })
  @IsOptional()
  @IsString()
  themeColor?: string
}

export class UpdateCanvasDto extends PartialType(CreateCanvasDto) {
  @ApiPropertyOptional({ description: 'pages 状态数据', type: Array })
  @IsOptional()
  @IsArray()
  pages?: any[]

  @ApiPropertyOptional({ description: 'track 状态数据', type: Array })
  @IsOptional()
  @IsArray()
  track?: any[]
}
