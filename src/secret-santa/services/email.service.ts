import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeTransporter();
  }

  /**
   * Inicializa o transporter do nodemailer
   */
  private initializeTransporter(): void {
    const host = this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const secure = this.configService.get<boolean>('SMTP_SECURE', false);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!user || !pass) {
      this.logger.warn(
        'SMTP_USER ou SMTP_PASS não configurados. O envio de emails não funcionará.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false, // Use false para port 587
      requireTLS: true, // Força uso de TLS
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false, // Para desenvolvimento
        ciphers: 'SSLv3',
      },
      connectionTimeout: 30000, // 30 segundos
      greetingTimeout: 30000, // 30 segundos
      socketTimeout: 30000, // 30 segundos
      pool: true, // Usa connection pooling
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
    });

    this.logger.log('Transporter de email inicializado');
  }

  /**
   * Envia email com o resultado do amigo oculto
   * Com retry automático em caso de falha
   */
  async sendSecretSantaEmail(
    email: string,
    secretFriendNickname: string,
    customTemplate?: string,
  ): Promise<void> {
    const fromEmail = this.configService.get<string>(
      'SMTP_FROM',
      this.configService.get<string>('SMTP_USER'),
    );
    const fromName = this.configService.get<string>('SMTP_FROM_NAME', 'Amigo Oculto');

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: '🎁 Seu Amigo Oculto foi sorteado!',
      html: customTemplate
        ? this.processCustomTemplate(customTemplate, secretFriendNickname)
        : this.generateEmailTemplate(secretFriendNickname),
      text: customTemplate
        ? this.processCustomTemplate(customTemplate, secretFriendNickname, true)
        : this.generateEmailText(secretFriendNickname),
    };

    const maxRetries = 3;
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`Tentativa ${attempt}/${maxRetries} de envio de email para ${email}`);
        const info = await Promise.race([
          this.transporter.sendMail(mailOptions),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout após 30 segundos')), 30000),
          ),
        ]);
        
        this.logger.log(`Email enviado com sucesso para ${email}. MessageId: ${info.messageId}`);
        return;
      } catch (error: any) {
        lastError = error;
        this.logger.warn(
          `Tentativa ${attempt}/${maxRetries} falhou para ${email}: ${error.message}`,
        );
        
        if (attempt < maxRetries) {
          const delay = attempt * 2000; // Backoff exponencial: 2s, 4s, 6s
          this.logger.log(`Aguardando ${delay}ms antes da próxima tentativa...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this.logger.error(`Falha ao enviar email para ${email} após ${maxRetries} tentativas`, lastError);
    throw new Error(`Falha ao enviar email após ${maxRetries} tentativas: ${lastError?.message}`);
  }

  /**
   * Processa template personalizado substituindo placeholders
   * Converte texto simples em HTML formatado
   */
  private processCustomTemplate(
    template: string,
    secretFriendNickname: string,
    isText: boolean = false,
  ): string {
    // Substitui {{secretFriend}} pelo nome do amigo oculto
    let processed = template.replace(/\{\{secretFriend\}\}/g, secretFriendNickname);
    
    if (isText) {
      // Versão texto: converte quebras de linha e formatação básica
      processed = processed
        .replace(/\n\n+/g, '\n\n') // Remove múltiplas quebras de linha
        .trim();
      return processed;
    }
    
    // Versão HTML: converte texto simples em HTML formatado
    // Escapa HTML para segurança
    processed = processed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Converte quebras de linha em parágrafos
    const paragraphs = processed.split(/\n\n+/).filter(p => p.trim());
    const formattedParagraphs = paragraphs.map(para => {
      // Converte quebras de linha simples em <br>
      const lines = para.split('\n').filter(l => l.trim());
      const formattedLines = lines.map(line => {
        // Detecta negrito simples **texto**
        let formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Detecta itálico simples *texto*
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        return formatted;
      });
      return `<p style="font-size: 16px; margin-bottom: 20px; line-height: 1.6;">${formattedLines.join('<br>')}</p>`;
    });
    
    // Envolve em estrutura HTML completa
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Amigo Oculto</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Amigo Oculto</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          ${formattedParagraphs.join('')}
          <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            <em>Este é um email automático do sistema de Amigo Oculto.</em>
          </p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Gera o template HTML do email
   */
  private generateEmailTemplate(secretFriendNickname: string): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Amigo Oculto</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Amigo Oculto</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Olá!
          </p>
          <p style="font-size: 16px; margin-bottom: 20px;">
            O sorteio do <strong>Amigo Oculto</strong> foi realizado!
          </p>
          <div style="background: white; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0; border: 2px solid #667eea;">
            <h2 style="color: #667eea; margin: 0; font-size: 24px;">Seu amigo e inimigo é ${secretFriendNickname}</h2>
          </div>
          <p style="font-size: 16px; margin-top: 20px;">
            Agora é só escolher o presente perfeito! 🎉
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            <em>Este é um email automático do sistema de Amigo Oculto.</em>
          </p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Gera a versão texto do email
   */
  private generateEmailText(secretFriendNickname: string): string {
    return `
🎁 Amigo Oculto

Olá!

O sorteio do Amigo Oculto foi realizado!

Seu amigo e inimigo é ${secretFriendNickname}

Agora é só escolher o presente perfeito! 🎉

---
Este é um email automático do sistema de Amigo Oculto.
    `.trim();
  }
}

