# 🔐 Verificação de Domínio no Resend - Guia Completo

## 📋 Por que verificar um domínio?

Sem verificação de domínio, o Resend só permite enviar emails para o próprio endereço cadastrado na conta. Após verificar um domínio, você pode enviar para **qualquer email**.

## 🎯 Pré-requisitos

1. Conta no Resend (já tem: https://resend.com)
2. Acesso ao DNS do seu domínio
3. Domínio próprio (ex: `seudominio.com`, `seudominio.net`, etc.)

**Não tem domínio?** Veja opções gratuitas no final deste guia.

---

## 🚀 Passo a Passo

### 1. Acessar o Dashboard do Resend

1. Acesse: https://resend.com/dashboard
2. Faça login na sua conta
3. No menu lateral, clique em **"Domains"**

### 2. Adicionar Domínio

1. Clique no botão **"Add Domain"** (canto superior direito)
2. Digite seu domínio (ex: `seudominio.com`)
   - **Não inclua** `www` ou `http://`
   - Apenas o domínio: `seudominio.com`
3. Clique em **"Add"**

### 3. Configurar Registros DNS

O Resend mostrará uma lista de registros DNS que você precisa adicionar. Você verá algo como:

```
Tipo: TXT
Nome: @
Valor: v=spf1 include:_spf.resend.com ~all

Tipo: TXT
Nome: @
Valor: resend._domainkey.seudominio.com p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...

Tipo: CNAME
Nome: resend._domainkey
Valor: resend._domainkey.resend.com
```

### 4. Adicionar Registros no seu Provedor DNS

**Onde adicionar?** No painel do seu provedor de domínio (Registro.br, GoDaddy, Namecheap, Cloudflare, etc.)

#### Exemplo: Registro.br

1. Acesse: https://registro.br
2. Faça login
3. Vá em **"Meus Domínios"** → Selecione seu domínio
4. Clique em **"DNS"** ou **"Zona DNS"**
5. Adicione cada registro mostrado pelo Resend:
   - **Tipo:** TXT ou CNAME (conforme indicado)
   - **Nome:** @ ou o nome específico
   - **Valor:** Cole o valor exato do Resend
   - **TTL:** 3600 (padrão)

#### Exemplo: Cloudflare

1. Acesse: https://dash.cloudflare.com
2. Selecione seu domínio
3. Vá em **"DNS"** → **"Records"**
4. Clique em **"Add record"**
5. Adicione cada registro:
   - **Type:** TXT ou CNAME
   - **Name:** @ ou o nome específico
   - **Content:** Cole o valor do Resend
   - **Proxy status:** Desabilitado (DNS only)

### 5. Aguardar Propagação DNS

- **Tempo estimado:** 5 minutos a 24 horas
- **Normalmente:** 10-30 minutos
- Os registros DNS precisam se propagar pela internet

### 6. Verificar Status no Resend

1. Volte ao dashboard do Resend
2. Vá em **"Domains"**
3. O status do seu domínio aparecerá como:
   - ⏳ **Pending** - Aguardando verificação
   - ✅ **Verified** - Domínio verificado e pronto!

### 7. Atualizar Variável de Ambiente

Após verificação, atualize no Railway:

1. Acesse o Railway: https://railway.app
2. Vá no seu projeto → **Variables**
3. Atualize `RESEND_FROM_EMAIL`:
   ```env
   RESEND_FROM_EMAIL=noreply@seudominio.com
   ```
   (Use qualquer email do seu domínio: `noreply@`, `contato@`, `sistema@`, etc.)

4. O Railway fará redeploy automático

---

## 🆓 Opções de Domínios Gratuitos

Se você não tem um domínio, aqui estão opções:

### 1. **Freenom** (Gratuito)
- Domínios `.tk`, `.ml`, `.ga`, `.cf`
- https://www.freenom.com
- ⚠️ Alguns provedores podem bloquear esses domínios

### 2. **Cloudflare Registrar** (Barato)
- Domínios a partir de $8/ano
- https://www.cloudflare.com/products/registrar/
- ✅ Muito confiável

### 3. **Namecheap** (Barato)
- Domínios a partir de $1-2/ano no primeiro ano
- https://www.namecheap.com
- ✅ Confiável e popular

### 4. **Registro.br** (Brasil)
- Domínios `.com.br` a partir de R$ 40/ano
- https://registro.br
- ✅ Ideal para brasileiros

---

## ✅ Verificação de Sucesso

Após verificar o domínio, teste:

```bash
curl -X POST https://amigo-oculto-backend-production-323a.up.railway.app/secret-santa/draw \
  -H "Content-Type: application/json" \
  -d '{
    "participants": [
      {
        "nickname": "João",
        "email": "joaomarcosjmos.ans@gmail.com"
      },
      {
        "nickname": "Teste",
        "email": "qualquer-email@qualquer-dominio.com"
      }
    ]
  }'
```

**Resultado esperado:**
- ✅ Email enviado para `joaomarcosjmos.ans@gmail.com` via Resend
- ✅ Email enviado para `qualquer-email@qualquer-dominio.com` via Resend
- ✅ Sem erros de "domínio não verificado"

---

## 🔍 Troubleshooting

### Domínio não verifica após 24h

1. **Verifique os registros DNS:**
   - Use: https://mxtoolbox.com/SuperTool.aspx
   - Digite seu domínio e verifique se os registros aparecem

2. **Verifique se copiou os valores corretamente:**
   - Um espaço extra pode quebrar a verificação
   - Certifique-se de copiar o valor completo

3. **Aguarde mais tempo:**
   - Alguns DNS podem demorar até 48h

### Erro: "Domain verification failed"

- Verifique se todos os registros foram adicionados
- Certifique-se de que o TTL está correto
- Aguarde a propagação DNS completa

### Emails ainda não enviam

- Verifique se atualizou `RESEND_FROM_EMAIL` no Railway
- Certifique-se de usar um email do domínio verificado
- Verifique os logs no Railway para erros específicos

---

## 📊 Status Atual

- ✅ Resend configurado
- ✅ API funcionando
- ⚠️ Domínio não verificado (limitação atual)
- ✅ Fallback para SMTP implementado (mas com timeout)

**Próximo passo:** Verificar domínio no Resend para remover limitação.

---

## 🔗 Links Úteis

- [Resend Dashboard](https://resend.com/dashboard)
- [Resend Domains](https://resend.com/domains)
- [Resend Documentation](https://resend.com/docs)
- [MXToolbox - Verificar DNS](https://mxtoolbox.com/SuperTool.aspx)

---

**Dúvidas?** Consulte a documentação oficial do Resend ou verifique os logs no Railway.

