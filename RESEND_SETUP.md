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

### 2. Configurar domínio (Opcional mas recomendado)

Para usar um email personalizado (ex: `noreply@seudominio.com`):

1. Vá em **Domains** no Resend
2. Adicione seu domínio
3. Configure os registros DNS conforme instruções
4. Aguarde a verificação (pode levar alguns minutos)

**Nota:** Você pode usar o domínio padrão do Resend (`onboarding@resend.dev`) para testes, mas é limitado.

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

### Erro: "Domain not verified"
- Use `onboarding@resend.dev` para testes
- Ou configure seu domínio no Resend

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

