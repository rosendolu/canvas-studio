import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { Asset, AssetSchema } from './asset.schema'
import { AssetService } from './asset.service'
import { AssetController } from './asset.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    // Use memory storage; AssetStorageService handles writing to disk
    MulterModule.register({ storage: memoryStorage() }),
  ],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
