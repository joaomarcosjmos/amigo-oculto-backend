import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { EmailService } from '../services/email.service';

export interface Participant {
  nickname: string;
  email: string;
  partnerEmail?: string; // Email do cônjuge/parceiro
}

export interface Assignment {
  email: string;
  secretFriendNickname: string;
}

@Injectable()
export class SecretSantaService {
  private readonly logger = new Logger(SecretSantaService.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Realiza o sorteio do amigo oculto
   * Garante que ninguém sorteie a si mesmo e que casais não se sortem
   */
  async drawSecretSanta(participants: Participant[]): Promise<Map<string, string>> {
    if (participants.length < 2) {
      throw new BadRequestException(
        'É necessário pelo menos 2 participantes para o sorteio',
      );
    }

    // Valida emails únicos
    const emails = participants.map(p => p.email);
    const uniqueEmails = Array.from(new Set(emails));
    if (uniqueEmails.length !== emails.length) {
      throw new BadRequestException('Os emails devem ser únicos');
    }

    // Cria mapeamento de email para apelido
    const emailToNickname = new Map<string, string>();
    const emailToPartner = new Map<string, string>(); // Email -> Email do parceiro
    participants.forEach(p => {
      emailToNickname.set(p.email, p.nickname);
      if (p.partnerEmail) {
        emailToPartner.set(p.email, p.partnerEmail);
        // Também mapeia o inverso (se A é parceiro de B, B é parceiro de A)
        emailToPartner.set(p.partnerEmail, p.email);
      }
    });

    // Algoritmo de Fisher-Yates com validação de casais
    const shuffled = [...participants];
    let attempts = 0;
    const maxAttempts = 500; // Aumentado para dar mais chances com restrições

    let validAssignment = false;
    do {
      this.shuffleArray(shuffled);
      attempts++;
      
      // Verifica se alguém sorteou a si mesmo
      const hasSelfAssignment = shuffled.some(
        (participant, index) => participant.email === participants[index].email,
      );

      if (hasSelfAssignment) {
        continue;
      }

      // Verifica se algum casal se sorteou
      const hasCoupleAssignment = participants.some((participant, index) => {
        const assignedEmail = shuffled[index].email;
        const partnerEmail = emailToPartner.get(participant.email);
        return partnerEmail && assignedEmail === partnerEmail;
      });

      if (!hasCoupleAssignment) {
        validAssignment = true;
        break;
      }

    } while (attempts < maxAttempts);

    if (!validAssignment) {
      throw new BadRequestException(
        'Não foi possível realizar o sorteio respeitando as restrições. Tente novamente.',
      );
    }

    // Cria o mapeamento: email -> apelido do amigo oculto
    const assignments = new Map<string, string>();
    participants.forEach((participant, index) => {
      assignments.set(participant.email, shuffled[index].nickname);
    });

    // Validação final
    const finalValidation = Array.from(assignments.entries()).every(
      ([email, secretFriendNickname]) => {
        const ownNickname = emailToNickname.get(email);
        if (ownNickname === secretFriendNickname) {
          return false; // Não pode sortear a si mesmo
        }
        
        // Verifica se não sorteou o parceiro
        const partnerEmail = emailToPartner.get(email);
        if (partnerEmail) {
          const partnerNickname = emailToNickname.get(partnerEmail);
          if (partnerNickname === secretFriendNickname) {
            return false; // Não pode sortear o parceiro
          }
        }
        
        return true;
      },
    );

    if (!finalValidation) {
      throw new BadRequestException(
        'Não foi possível realizar o sorteio. Tente novamente.',
      );
    }

    this.logger.log(`Sorteio realizado com sucesso`);
    
    return assignments;
  }

  /**
   * Realiza o sorteio e envia os emails
   */
  async drawAndSendEmails(
    participants: Participant[],
    emailTemplate?: string,
  ): Promise<Map<string, string>> {
    const assignments = await this.drawSecretSanta(participants);

    // Envia emails de forma assíncrona
    const emailPromises = Array.from(assignments.entries()).map(
      async ([email, secretFriendNickname]) => {
        try {
          await this.emailService.sendSecretSantaEmail(
            email,
            secretFriendNickname,
            emailTemplate,
          );
          // Log removido para não expor informações sensíveis
        } catch (error) {
          this.logger.error(`Erro ao enviar email`, error);
          throw error;
        }
      },
    );

    await Promise.all(emailPromises);
    this.logger.log('Todos os emails foram enviados com sucesso');

    return assignments;
  }

  /**
   * Algoritmo Fisher-Yates para embaralhar array
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

