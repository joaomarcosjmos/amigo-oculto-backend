import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecretSantaModule } from './secret-santa/secret-santa.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SecretSantaModule,
  ],
})
export class AppModule {}

