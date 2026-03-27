import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator'

const ASSET_TYPES = ['background', 'sticker', 'apng', 'product', 'bubbleText', 'other']

export class UpdateAssetDto {
  @IsOptional() @IsString() name?: string
  @IsOptional() @IsEnum(ASSET_TYPES) assetType?: string
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[]
}

export class ListAssetsDto {
  @IsOptional() @IsEnum(ASSET_TYPES) assetType?: string
  @IsOptional() @IsString() q?: string
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[]
}
