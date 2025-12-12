import { IsArray, IsEmail, IsNotEmpty, ArrayMinSize, ArrayUnique, ValidateNested, IsString, IsOptional, ValidateIf } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ParticipantDto {
  @IsString()
  @IsNotEmpty({ message: 'O apelido é obrigatório' })
  nickname: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : value)
  @ValidateIf((o) => o.partnerEmail !== undefined && o.partnerEmail !== null && o.partnerEmail !== '')
  @IsEmail({}, { message: 'Email do parceiro inválido' })
  partnerEmail?: string; // Email do cônjuge/parceiro (opcional)
}

export class CreateSecretSantaDto {
  @IsArray()
  @ArrayMinSize(2, { message: 'É necessário pelo menos 2 participantes para o sorteio' })
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  @IsNotEmpty({ message: 'A lista de participantes não pode estar vazia' })
  participants: ParticipantDto[];

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : value)
  @ValidateIf((o) => o.organizerEmail !== undefined && o.organizerEmail !== null && o.organizerEmail !== '')
  @IsEmail({}, { message: 'Email do organizador inválido' })
  organizerEmail?: string; // Se especificado, oculta os resultados na resposta

  @IsOptional()
  @IsString()
  emailTemplate?: string; // Template personalizado do email (usa {{secretFriend}} como placeholder)
}

