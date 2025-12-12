export class SecretSantaResultDto {
  email: string;
  secretFriend: string;
}

export class SecretSantaResponseDto {
  success: boolean;
  message: string;
  results?: SecretSantaResultDto[];
  totalParticipants: number;
}

