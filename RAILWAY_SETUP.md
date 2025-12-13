# 🚂 Setup Railway - Passo a Passo

## 📋 Pré-requisitos

1. Conta no Railway: https://railway.app
2. Repositório no GitHub (já tem)

## 🚀 Deploy no Railway

### 1. Criar Projeto no Railway

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha o repositório: `amigo-oculto-backend` (ou o nome do seu repo)

### 2. Configurar Variáveis de Ambiente

No Railway, vá em **Variables** e adicione:

```env
# Porta (Railway define automaticamente, mas pode definir)
PORT=3000

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=amigo.oculto.inimigo.pt@gmail.com
SMTP_PASS=cmpi kbxp chyh lbfe
SMTP_FROM=amigo.oculto.inimigo.pt@gmail.com
SMTP_FROM_NAME=Amigo Oculto

# Resend (Opcional - se quiser usar)
RESEND_API_KEY=re_PFHE4Ysd_FkYrDSer3WyLKq3LwcbXhWpw
RESEND_FROM_EMAIL=onboarding@resend.dev

# Node Environment
NODE_ENV=production
```

### 3. Configurar Domínio Público

1. No Railway, vá em **Settings**
2. Clique em **"Generate Domain"**
3. Railway gerará uma URL: `https://seu-projeto.up.railway.app`
4. Copie essa URL

### 4. Atualizar CORS no Frontend

No arquivo `frontend/src/App.tsx`, atualize a URL da API:

```typescript
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
```

E configure a variável de ambiente no Vercel/Netlify:

```env
VITE_API_URL=https://seu-projeto.up.railway.app
```

Ou no `src/main.ts` do backend, adicione a URL do frontend:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://seu-frontend.vercel.app',
    'https://seu-projeto.up.railway.app',
  ],
});
```

### 5. Deploy Automático

O Railway faz deploy automático quando você faz push para o GitHub!

## ✅ Verificação

Após o deploy:

1. Acesse a URL gerada pelo Railway
2. Teste: `https://seu-projeto.up.railway.app/health` (se tiver endpoint)
3. Faça um teste de sorteio pelo frontend
4. Verifique os logs no Railway

## 🔍 Troubleshooting

### Build falha
- Verifique os logs no Railway
- Certifique-se de que `npm run build` funciona localmente

### Porta não encontrada
- Railway define `PORT` automaticamente
- O código já usa `process.env.PORT || 3000`

### Emails não enviam
- Verifique as variáveis de ambiente
- Teste com Resend primeiro (mais confiável)
- Verifique logs no Railway

## 📊 Monitoramento

No Railway você pode:
- Ver logs em tempo real
- Ver métricas de uso
- Configurar alertas
- Ver histórico de deploys

## 💰 Custos

- **Plano gratuito:** $5 créditos/mês
- **Uso estimado:** ~$2-3/mês para uso moderado
- **Suficiente para:** Dezenas de sorteios por mês

---

**Pronto!** Seu backend estará rodando no Railway! 🎉

