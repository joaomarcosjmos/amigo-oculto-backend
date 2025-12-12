import { Module } from '@nestjs/common';
import { SecretSantaController } from './secret-santa.controller';
import { SecretSantaService } from './services/secret-santa.service';
import { EmailService } from './services/email.service';

@Module({
  controllers: [SecretSantaController],
  providers: [SecretSantaService, EmailService],
  exports: [SecretSantaService, EmailService],
})
export class SecretSantaModule {}

