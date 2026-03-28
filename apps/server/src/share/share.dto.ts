import { IsNotEmpty, IsOptional, IsBoolean, IsEnum } from 'class-validator'

export class CreateShareDto {
  @IsNotEmpty() snapshot: Record<string, any>
  @IsNotEmpty() aspectRatio: string
  @IsOptional() bgColor?: string
  @IsOptional() @IsEnum(['never', '24h', '7d']) expiry?: '24h' | '7d' | 'never'
  @IsOptional() @IsBoolean() allowFork?: boolean
}
