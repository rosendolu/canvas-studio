import { IsString, IsOptional, IsArray, IsNotEmpty, ValidateNested, IsNumber, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class BrandColorDto {
  @IsString() label: string
  @IsString() value: string
}

export class BrandTypographyDto {
  @IsString() fontFamily: string
  @IsNumber() fontSize: number
  @IsString() color: string
  @IsOptional() @IsNumber() lineHeight?: number
}

export class CreateBrandKitDto {
  @IsString() @IsNotEmpty() @MaxLength(100) name: string
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => BrandColorDto) palette?: BrandColorDto[]
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => BrandTypographyDto) typography?: BrandTypographyDto[]
  @IsOptional() @IsString() logoAssetId?: string
}

export class UpdateBrandKitDto {
  @IsOptional() @IsString() @MaxLength(100) name?: string
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => BrandColorDto) palette?: BrandColorDto[]
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => BrandTypographyDto) typography?: BrandTypographyDto[]
  @IsOptional() @IsString() logoAssetId?: string
}
