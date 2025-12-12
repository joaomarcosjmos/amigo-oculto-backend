import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Resend } from 'resend';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private resend: Resend | null = null;
  private useResend: boolean = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeEmailProvider();
  }

  /**
   * Inicializa o provedor de email (Resend ou SMTP)
   */
  private initializeEmailProvider(): void {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    
    if (resendApiKey) {
      // Usa Resend se a API key estiver configurada
      this.resend = new Resend(resendApiKey);
      this.useResend = true;
      this.logger.log('EmailService inicializado com Resend');
      return;
    }

    // Fallback para SMTP
    this.initializeSMTP();
  }

  /**
   * Inicializa o transporter SMTP (fallback)
   */
  private initializeSMTP(): void {
    const host = this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!user || !pass) {
      this.logger.warn(
        'SMTP_USER ou SMTP_PASS não configurados. O envio de emails não funcionará.',
      );
    }

    const transportOptions: any = {
      host,
      port,
      secure: port === 465, // true para 465, false para outros
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false, // Para desenvolvimento/produção com certificados auto-assinados
        minVersion: 'TLSv1.2', // Versão mínima de TLS
      },
      // Timeouts ajustados para plano gratuito do Render (limitações de rede)
      connectionTimeout: 20000, // 20 segundos (reduzido para plano gratuito)
      greetingTimeout: 15000, // 15 segundos
      socketTimeout: 20000, // 20 segundos
    };

    if (port === 587) {
      transportOptions.requireTLS = true; // Força TLS apenas na porta 587
    }

    this.transporter = nodemailer.createTransport(transportOptions);
    this.logger.log('EmailService inicializado com SMTP (Nodemailer)');
  }

  /**
   * Envia email com o resultado do amigo oculto
   * Com retry automático em caso de falha
   * Usa Resend se configurado, caso contrário usa SMTP
   */
  async sendSecretSantaEmail(
    email: string,
    secretFriendNickname: string,
    customTemplate?: string,
  ): Promise<void> {
    if (this.useResend && this.resend) {
      return this.sendWithResend(email, secretFriendNickname, customTemplate);
    }

    return this.sendWithSMTP(email, secretFriendNickname, customTemplate);
  }

  /**
   * Envia email usando Resend
   */
  private async sendWithResend(
    email: string,
    secretFriendNickname: string,
    customTemplate?: string,
  ): Promise<void> {
    const fromEmail = this.configService.get<string>(
      'RESEND_FROM_EMAIL',
      this.configService.get<string>('SMTP_FROM', 'noreply@example.com'),
    );
    const fromName = this.configService.get<string>('SMTP_FROM_NAME', 'Amigo Oculto');

    const htmlContent = customTemplate
      ? this.processCustomTemplate(customTemplate, secretFriendNickname)
      : this.generateEmailTemplate(secretFriendNickname);
    
    const textContent = customTemplate
      ? this.processCustomTemplate(customTemplate, secretFriendNickname, true)
      : this.generateEmailText(secretFriendNickname);

    const maxRetries = 3;
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`[Resend] Tentativa ${attempt}/${maxRetries} de envio de email para ${email}`);
        
        const { data, error } = await this.resend!.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: email,
          subject: '🎁 Seu Amigo Oculto foi sorteado!',
          html: htmlContent,
          text: textContent,
        });

        if (error) {
          throw new Error(error.message || 'Erro ao enviar email via Resend');
        }

        this.logger.log(`[Resend] Email enviado com sucesso para ${email}. ID: ${data?.id}`);
        return;
      } catch (error: any) {
        lastError = error;
        const errorMessage = error.message || 'Erro desconhecido';
        this.logger.warn(
          `[Resend] Tentativa ${attempt}/${maxRetries} falhou para ${email}: ${errorMessage}`,
        );
        
        if (attempt < maxRetries) {
          const delay = attempt * 2000; // Backoff exponencial: 2s, 4s, 6s
          this.logger.log(`Aguardando ${delay}ms antes da próxima tentativa...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this.logger.error(`[Resend] Falha ao enviar email para ${email} após ${maxRetries} tentativas`, lastError);
    throw new Error(`Falha ao enviar email após ${maxRetries} tentativas: ${lastError?.message}`);
  }

  /**
   * Envia email usando SMTP (Nodemailer)
   */
  private async sendWithSMTP(
    email: string,
    secretFriendNickname: string,
    customTemplate?: string,
  ): Promise<void> {
    if (!this.transporter) {
      throw new Error('Transporter SMTP não inicializado');
    }

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
        this.logger.log(`[SMTP] Tentativa ${attempt}/${maxRetries} de envio de email para ${email}`);
        
        // Timeout ajustado para plano gratuito do Render (25 segundos)
        const info = await Promise.race([
          this.transporter.sendMail(mailOptions),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout após 25 segundos')), 25000),
          ),
        ]);
        
        this.logger.log(`[SMTP] Email enviado com sucesso para ${email}. MessageId: ${info.messageId}`);
        return;
      } catch (error: any) {
        lastError = error;
        const errorMessage = error.message || 'Erro desconhecido';
        this.logger.warn(
          `[SMTP] Tentativa ${attempt}/${maxRetries} falhou para ${email}: ${errorMessage}`,
        );
        
        if (attempt < maxRetries) {
          const delay = attempt * 2000; // Backoff exponencial: 2s, 4s, 6s
          this.logger.log(`Aguardando ${delay}ms antes da próxima tentativa...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this.logger.error(`[SMTP] Falha ao enviar email para ${email} após ${maxRetries} tentativas`, lastError);
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

