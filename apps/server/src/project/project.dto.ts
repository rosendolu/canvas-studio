import { IsString, IsOptional, IsBoolean } from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'

export class CreateProjectDto {
  @ApiProperty({ example: '我的项目' })
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean

  @ApiPropertyOptional({ example: '#00c5a7' })
  @IsOptional()
  @IsString()
  themeColor?: string
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
