import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { SecretSantaService } from './services/secret-santa.service';
import { CreateSecretSantaDto } from './dto/create-secret-santa.dto';
import { SecretSantaResponseDto } from './dto/secret-santa-result.dto';

@Controller('secret-santa')
export class SecretSantaController {
  private readonly logger = new Logger(SecretSantaController.name);

  constructor(private readonly secretSantaService: SecretSantaService) {}

  @Post('draw')
  @HttpCode(HttpStatus.OK)
  async drawSecretSanta(
    @Body() createSecretSantaDto: CreateSecretSantaDto,
  ): Promise<SecretSantaResponseDto> {
    this.logger.log(
      `Iniciando sorteio para ${createSecretSantaDto.participants.length} participantes`,
    );

    if (createSecretSantaDto.organizerEmail) {
      this.logger.log(`Modo privado: resultados ocultos para o organizador`);
    }

    try {
      const assignments = await this.secretSantaService.drawAndSendEmails(
        createSecretSantaDto.participants,
        createSecretSantaDto.emailTemplate,
      );

      // Se o organizador está participando, oculta os resultados
      if (createSecretSantaDto.organizerEmail) {
        const organizerResult = assignments.get(createSecretSantaDto.organizerEmail);
        return {
          success: true,
          message: 'Sorteio realizado e emails enviados com sucesso! Os resultados foram ocultados pois você está participando.',
          results: organizerResult
            ? [{ email: createSecretSantaDto.organizerEmail, secretFriend: organizerResult }]
            : undefined,
          totalParticipants: assignments.size,
        };
      }

      // Retorna todos os resultados se o organizador não está participando
      const results = Array.from(assignments.entries()).map(([email, secretFriendNickname]) => ({
        email,
        secretFriend: secretFriendNickname,
      }));

      this.logger.log('Sorteio concluído com sucesso');

      return {
        success: true,
        message: 'Sorteio realizado e emails enviados com sucesso!',
        results,
        totalParticipants: results.length,
      };
    } catch (error) {
      this.logger.error('Erro ao realizar sorteio:', error);
      throw error;
    }
  }
}

