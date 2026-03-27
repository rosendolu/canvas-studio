import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, MaxLength } from 'class-validator'

export class CreateTemplateDto {
  @IsString() @IsNotEmpty() @MaxLength(100) name: string
  @IsOptional() @IsString() @MaxLength(500) description?: string
  @IsEnum(['scene', 'overlay']) type: string
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[]
  @IsOptional() @IsString() thumbnail?: string
  @IsNotEmpty() payload: Record<string, any>
}

export class UpdateTemplateDto {
  @IsOptional() @IsString() @MaxLength(100) name?: string
  @IsOptional() @IsString() @MaxLength(500) description?: string
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[]
  @IsOptional() @IsString() thumbnail?: string
  @IsOptional() payload?: Record<string, any>
}

export class ListTemplatesDto {
  @IsOptional() @IsEnum(['scene', 'overlay']) type?: string
  @IsOptional() @IsString() q?: string
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[]
}
