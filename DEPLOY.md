# 🚀 Guia de Deploy - Amigo Oculto

Este guia apresenta opções gratuitas e baratas para fazer deploy do sistema Amigo Oculto.

## 📋 Pré-requisitos

- Conta GitHub (para versionamento)
- Conta no serviço de deploy escolhido
- Variáveis de ambiente configuradas

## 🔐 Variáveis de Ambiente Necessárias

Configure estas variáveis no serviço de deploy:

```env
NODE_ENV=production
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=amigo.oculto.inimigo.pt@gmail.com
SMTP_PASS=cmpi kbxp chyh lbfe
SMTP_FROM=amigo.oculto.inimigo.pt@gmail.com
SMTP_FROM_NAME=Amigo Oculto
```

---

## 🎯 Opção 1: Render.com (Recomendado - Gratuito)

**Render** oferece plano gratuito com:
- ✅ Backend Node.js gratuito
- ✅ Frontend estático gratuito
- ✅ SSL automático
- ✅ Deploy automático via GitHub

### Backend no Render

1. **Crie uma conta** em [render.com](https://render.com)

2. **Conecte seu repositório GitHub**

3. **Crie um novo Web Service:**
   - **Name:** `amigo-oculto-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Root Directory:** (deixe vazio, raiz do projeto)

4. **Configure as variáveis de ambiente** na aba "Environment":
   ```
   NODE_ENV=production
   PORT=3000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=amigo.oculto.inimigo.pt@gmail.com
   SMTP_PASS=cmpi kbxp chyh lbfe
   SMTP_FROM=amigo.oculto.inimigo.pt@gmail.com
   SMTP_FROM_NAME=Amigo Oculto
   ```

5. **Deploy automático** será iniciado

6. **Anote a URL** do backend (ex: `https://amigo-oculto-backend.onrender.com`)

### Frontend no Render

1. **Crie um novo Static Site:**
   - **Name:** `amigo-oculto-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`

2. **Configure variável de ambiente:**
   ```
   VITE_API_URL=https://amigo-oculto-backend.onrender.com
   ```

3. **Deploy automático** será iniciado

4. **Sua aplicação estará disponível** em uma URL como:
   `https://amigo-oculto-frontend.onrender.com`

---

## 🎯 Opção 2: Vercel (Frontend) + Render (Backend)

**Vercel** é excelente para frontend React/Vite:
- ✅ Deploy instantâneo
- ✅ CDN global
- ✅ SSL automático
- ✅ Plano gratuito generoso

### Frontend no Vercel

1. **Instale Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **No diretório do projeto:**
   ```bash
   cd frontend
   vercel
   ```

3. **Siga as instruções:**
   - Conecte sua conta Vercel
   - Configure o projeto
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Configure variável de ambiente:**
   - No painel Vercel: Settings → Environment Variables
   - Adicione: `VITE_API_URL=https://seu-backend-url.onrender.com`

5. **Deploy:**
   ```bash
   vercel --prod
   ```

### Backend no Render

Siga as instruções da **Opção 1** para o backend.

---

## 🎯 Opção 3: Railway (Tudo em um lugar)

**Railway** oferece:
- ✅ Deploy simples via GitHub
- ✅ Plano gratuito com $5 de crédito/mês
- ✅ SSL automático

### Deploy no Railway

1. **Crie uma conta** em [railway.app](https://railway.app)

2. **Conecte seu repositório GitHub**

3. **Crie um novo projeto** e adicione um serviço

4. **Configure o serviço:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`

5. **Configure as variáveis de ambiente** (mesmas do Render)

6. **Para o frontend:**
   - Crie outro serviço
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx serve -s dist -p $PORT`

---

## 🎯 Opção 4: Fly.io (Gratuito com limites)

**Fly.io** oferece:
- ✅ Plano gratuito generoso
- ✅ Deploy global
- ✅ Docker support

### Deploy no Fly.io

1. **Instale Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Crie o app:**
   ```bash
   fly launch
   ```

4. **Configure variáveis:**
   ```bash
   fly secrets set SMTP_HOST=smtp.gmail.com
   fly secrets set SMTP_PORT=587
   # ... outras variáveis
   ```

---

## 📝 Configuração do Frontend

Após fazer deploy do backend, atualize a URL da API no frontend:

1. **No arquivo `frontend/src/App.tsx`**, a URL já está configurada para usar variável de ambiente:
   ```typescript
   const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
   ```

2. **Configure `VITE_API_URL`** no serviço de deploy do frontend com a URL do seu backend.

---

## 🔧 Troubleshooting

### Backend não inicia
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs no painel do serviço
- Confirme que a porta está configurada corretamente

### Frontend não conecta ao backend
- Verifique se `VITE_API_URL` está configurada corretamente
- Confirme que o backend está rodando e acessível
- Verifique CORS no backend (já configurado no código)

### Emails não são enviados
- Verifique as credenciais SMTP
- Confirme que a senha de app do Gmail está correta
- Verifique os logs do backend para erros

---

## 📊 Comparação de Serviços

| Serviço | Backend | Frontend | Gratuito | Facilidade |
|---------|---------|----------|----------|------------|
| **Render** | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **Vercel** | ❌ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **Railway** | ✅ | ✅ | 💰 ($5/mês) | ⭐⭐⭐⭐ |
| **Fly.io** | ✅ | ✅ | ✅ | ⭐⭐⭐ |

---

## 🎉 Recomendação Final

**Para começar rápido:** Use **Render.com** para ambos (backend e frontend)
- Gratuito
- Fácil configuração
- Deploy automático via GitHub
- SSL automático

**Para melhor performance:** Use **Vercel** (frontend) + **Render** (backend)
- Vercel tem CDN global excelente para frontend
- Render é confiável para backend Node.js

---

## 📚 Próximos Passos

1. Escolha um serviço de deploy
2. Configure as variáveis de ambiente
3. Faça push do código para GitHub
4. Conecte o repositório ao serviço
5. Aguarde o deploy automático
6. Teste a aplicação!

**Boa sorte com o deploy! 🚀**
