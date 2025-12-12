# 🚀 Alternativas de Deploy Gratuito

Comparação de plataformas gratuitas para deploy do backend:

## 🏆 Recomendações (Melhor para SMTP)

### 1. **Railway** ⭐ RECOMENDADO
- ✅ **Plano gratuito:** $5 créditos/mês (suficiente para uso moderado)
- ✅ **Melhor para SMTP:** Menos bloqueios de firewall
- ✅ **Deploy automático:** Conecta com GitHub
- ✅ **Logs em tempo real**
- ✅ **Variáveis de ambiente** fáceis
- ✅ **SSL automático**
- 🔗 https://railway.app

**Setup:**
1. Crie conta no Railway
2. Conecte com GitHub
3. Selecione o repositório
4. Railway detecta automaticamente (NestJS)
5. Adicione variáveis de ambiente
6. Deploy automático!

**Vantagens:**
- Menos problemas com timeouts SMTP
- Rede mais estável
- Suporte a WebSockets (se precisar no futuro)

---

### 2. **Fly.io** ⭐ BOA OPÇÃO
- ✅ **Plano gratuito:** 3 VMs compartilhadas
- ✅ **Boa para SMTP:** Rede global
- ✅ **Deploy rápido**
- ✅ **Escalável**
- 🔗 https://fly.io

**Setup:**
```bash
# Instalar CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
fly launch
fly deploy
```

**Vantagens:**
- Rede distribuída globalmente
- Menos bloqueios de IP
- Boa performance

---

### 3. **Render** (Atual)
- ⚠️ **Plano gratuito:** Limitado
- ⚠️ **Problemas:** Timeouts SMTP, IPs compartilhados
- ✅ **Fácil setup**
- 🔗 https://render.com

**Limitações conhecidas:**
- Timeouts frequentes com SMTP
- IPs compartilhados podem ser bloqueados pelo Gmail
- Melhor usar Resend ou outro serviço de email

---

## 📊 Comparação Rápida

| Plataforma | Plano Grátis | SMTP Funciona? | Facilidade | Recomendado |
|------------|--------------|----------------|------------|-------------|
| **Railway** | $5 créditos/mês | ✅ Sim | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Fly.io** | 3 VMs | ✅ Sim | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Render** | Limitado | ⚠️ Com problemas | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Vercel** | Generoso | ❌ Só frontend | ⭐⭐⭐⭐⭐ | ❌ |
| **Heroku** | ❌ Pago | ✅ Sim | ⭐⭐⭐⭐ | ❌ |

---

## 🎯 Recomendação Final

### Para seu caso (Amigo Oculto):

**Opção 1: Railway** (Melhor escolha)
- Menos problemas com SMTP
- $5 créditos/mês grátis (suficiente)
- Deploy automático do GitHub
- Interface simples

**Opção 2: Fly.io** (Alternativa sólida)
- Rede global
- Boa performance
- Um pouco mais complexo de configurar

**Opção 3: Continuar no Render + Resend**
- Se você verificar um domínio no Resend
- Funciona bem, mas tem limitações no plano gratuito

---

## 🚀 Setup Rápido no Railway

### 1. Criar conta
- Acesse: https://railway.app
- Faça login com GitHub

### 2. Criar projeto
- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Escolha seu repositório

### 3. Configurar variáveis
Railway detecta automaticamente que é Node.js. Adicione:

```env
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=amigo.oculto.inimigo.pt@gmail.com
SMTP_PASS=cmpi kbxp chyh lbfe
SMTP_FROM=amigo.oculto.inimigo.pt@gmail.com
SMTP_FROM_NAME=Amigo Oculto
```

### 4. Deploy
- Railway faz deploy automático
- Gera URL: `https://seu-projeto.up.railway.app`

### 5. Atualizar CORS no frontend
No `src/main.ts`, adicione a URL do Railway:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://seu-frontend.vercel.app',
    'https://seu-projeto.up.railway.app', // Adicione esta linha
  ],
});
```

---

## 🔧 Arquivos de Configuração

### Railway (`railway.json` - já existe)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Fly.io (`fly.toml` - criar se necessário)
```toml
app = "amigo-oculto-backend"
primary_region = "gru"  # São Paulo

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "3000"
  NODE_ENV = "production"

[[services]]
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

---

## 💡 Dica Extra

**Para melhorar ainda mais:**
1. Use **Resend** (já implementado) - funciona em qualquer plataforma
2. Ou use **SendGrid** - 100 emails/dia grátis
3. Ou use **Mailgun** - 5.000 emails/mês grátis

Esses serviços de email são mais confiáveis que SMTP direto, independente da plataforma de deploy.

---

## 📝 Próximos Passos

1. **Escolha uma plataforma** (recomendo Railway)
2. **Faça o deploy**
3. **Teste o envio de emails**
4. **Atualize o frontend** com a nova URL da API

Quer ajuda para fazer o deploy em alguma dessas plataformas?

