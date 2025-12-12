# 📧 Configuração do Resend

O sistema agora suporta **Resend** como provedor de email principal, com fallback automático para SMTP.

## 🚀 Por que usar Resend?

- ✅ **3.000 emails/mês grátis**
- ✅ **Mais confiável** que SMTP no Render (plano gratuito)
- ✅ **API simples** e rápida
- ✅ **Sem problemas de timeout** ou bloqueios de firewall
- ✅ **Melhor para produção**

## 📋 Como configurar

### 1. Criar conta no Resend

1. Acesse: https://resend.com
2. Crie uma conta gratuita
3. Vá em **API Keys** e crie uma nova chave
4. Copie a chave API (começa com `re_`)

### 2. Configurar domínio (OBRIGATÓRIO para produção)

⚠️ **IMPORTANTE:** O domínio de teste (`onboarding@resend.dev`) só permite enviar emails para o próprio endereço cadastrado na conta do Resend.

**Para enviar para qualquer destinatário, você DEVE verificar um domínio:**

1. Vá em **Domains** no Resend
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `seudominio.com`)
4. Configure os registros DNS conforme instruções:
   - Adicione os registros SPF, DKIM e DMARC no seu provedor DNS
5. Aguarde a verificação (pode levar alguns minutos)
6. Após verificado, use um email do seu domínio (ex: `noreply@seudominio.com`)

**Alternativa temporária:** Se não tiver um domínio, o sistema fará fallback automático para SMTP quando detectar que o domínio não está verificado.

### 3. Configurar variáveis de ambiente no Render

Adicione estas variáveis no painel do Render:

```env
# Resend (Prioridade - se configurado, usa Resend)
RESEND_API_KEY=re_sua_chave_api_aqui
RESEND_FROM_EMAIL=noreply@seudominio.com  # ou onboarding@resend.dev para testes

# SMTP (Fallback - usado apenas se RESEND_API_KEY não estiver configurado)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=seu-email@gmail.com
SMTP_FROM_NAME=Amigo Oculto
```

### 4. Ordem de prioridade

O sistema usa esta ordem:

1. **Resend** (se `RESEND_API_KEY` estiver configurado)
2. **SMTP** (fallback se Resend não estiver configurado)

## ✅ Testando

Após configurar, faça um teste de sorteio. Os logs mostrarão:

- `[Resend]` - se estiver usando Resend
- `[SMTP]` - se estiver usando SMTP

## 🔍 Troubleshooting

### Erro: "Invalid API key"
- Verifique se a chave API está correta
- Certifique-se de que copiou a chave completa (começa com `re_`)

### Erro: "You can only send testing emails to your own email address"
- **Causa:** Você está usando o domínio de teste (`onboarding@resend.dev`)
- **Solução:** Verifique um domínio no Resend (veja seção 2 acima)
- **Fallback:** O sistema tentará usar SMTP automaticamente se o domínio não estiver verificado

### Erro: "Too many requests" / Rate limit
- O Resend tem limite de 2 requisições por segundo no plano gratuito
- O sistema já implementa delay automático de 600ms entre envios
- Se persistir, aumente o delay no código ou aguarde alguns segundos

### Ainda usando SMTP?
- Verifique se `RESEND_API_KEY` está configurado corretamente
- Verifique os logs para ver qual provedor está sendo usado

## 📊 Limites do plano gratuito

- **3.000 emails/mês**
- **100 emails/dia**
- Domínio próprio (após verificação)
- Suporte por email

## 🔗 Links úteis

- [Resend Dashboard](https://resend.com/dashboard)
- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)

