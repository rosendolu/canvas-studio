import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CanvasModule } from './canvas/canvas.module'
import { ProjectModule } from './project/project.module'
import { TemplateModule } from './template/template.module'
import { AssetModule } from './asset/asset.module'
import { BrandKitModule } from './brandkit/brandkit.module'

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/canvas-studio'),
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    CanvasModule,
    ProjectModule,
    TemplateModule,
    AssetModule,
    BrandKitModule,
  ],
})
export class AppModule {}
