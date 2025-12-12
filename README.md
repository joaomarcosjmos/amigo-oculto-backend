# 🎁 Sistema de Amigo Oculto

Sistema desenvolvido em NestJS para realizar sorteios de amigo oculto e enviar os resultados por email.

## 📋 Funcionalidades

- ✅ Recebe uma lista de emails
- ✅ Realiza o sorteio garantindo que ninguém sorteie a si mesmo
- ✅ Envia email para cada participante com o nome do amigo oculto
- ✅ Validação de dados de entrada
- ✅ Tratamento de erros robusto
- ✅ Logging estruturado

## 🚀 Como usar

### 1. Instalação

```bash
npm install
```

### 2. Configuração

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=seu-email@gmail.com
SMTP_FROM_NAME=Amigo Oculto
```

**Para Gmail:**
1. Ative a verificação em duas etapas
2. Acesse: https://myaccount.google.com/apppasswords
3. Gere uma "Senha de app"
4. Use essa senha no `SMTP_PASS`

### 3. Executar

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📡 API

### POST `/secret-santa/draw`

Realiza o sorteio e envia os emails.

**Request Body:**
```json
{
  "emails": [
    "participante1@email.com",
    "participante2@email.com",
    "participante3@email.com"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sorteio realizado e emails enviados com sucesso!",
  "results": [
    {
      "email": "participante1@email.com",
      "secretFriend": "participante2@email.com"
    },
    {
      "email": "participante2@email.com",
      "secretFriend": "participante3@email.com"
    },
    {
      "email": "participante3@email.com",
      "secretFriend": "participante1@email.com"
    }
  ],
  "totalParticipants": 3
}
```

## 🧪 Testando com cURL

```bash
curl -X POST http://localhost:3000/secret-santa/draw \
  -H "Content-Type: application/json" \
  -d '{
    "emails": [
      "participante1@email.com",
      "participante2@email.com",
      "participante3@email.com"
    ]
  }'
```

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **SOLID**:

- **Controllers**: Recebem requisições HTTP e delegam para os serviços
- **Services**: Contêm a lógica de negócio
- **DTOs**: Validam e tipam os dados de entrada/saída
- **Modules**: Organizam a estrutura do aplicativo

### Estrutura de Pastas

```
src/
├── main.ts                    # Ponto de entrada
├── app.module.ts             # Módulo principal
└── secret-santa/
    ├── secret-santa.module.ts
    ├── secret-santa.controller.ts
    ├── services/
    │   ├── secret-santa.service.ts  # Lógica de sorteio
    │   └── email.service.ts        # Envio de emails
    └── dto/
        ├── create-secret-santa.dto.ts
        └── secret-santa-result.dto.ts
```

## 🔒 Validações

- Mínimo de 2 participantes
- Emails únicos (sem duplicatas)
- Formato de email válido
- Garantia de que ninguém sorteie a si mesmo

## 📝 Logs

O sistema utiliza logging estruturado do NestJS para facilitar o debug e monitoramento.

## 🛠️ Tecnologias

- **NestJS**: Framework Node.js
- **TypeScript**: Linguagem
- **Nodemailer**: Envio de emails
- **class-validator**: Validação de DTOs
- **class-transformer**: Transformação de dados

## 📄 Licença

MIT

