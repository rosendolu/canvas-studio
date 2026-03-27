import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BrandKit, BrandKitSchema } from './brandkit.schema'
import { BrandKitService } from './brandkit.service'
import { BrandKitController } from './brandkit.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BrandKit.name, schema: BrandKitSchema }]),
  ],
  providers: [BrandKitService],
  controllers: [BrandKitController],
  exports: [BrandKitService],
})
export class BrandKitModule {}
