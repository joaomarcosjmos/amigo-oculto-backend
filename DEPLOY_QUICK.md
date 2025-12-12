# 🚀 Deploy Rápido - Amigo Oculto

## ⚡ Opção Mais Rápida: Render.com

### Passo 1: Preparar o Repositório

```bash
# Inicializar Git (se ainda não fez)
git init
git add .
git commit -m "Initial commit"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/SEU_USUARIO/amigo-oculto.git
git branch -M main
git push -u origin main
```

### Passo 2: Deploy do Backend no Render

1. Acesse: https://render.com
2. Faça login com GitHub
3. Clique em **"New +"** → **"Web Service"**
4. Conecte seu repositório GitHub
5. Configure:
   - **Name:** `amigo-oculto-backend`
   - **Environment:** `Node`
   - **Region:** Escolha o mais próximo
   - **Branch:** `main`
   - **Root Directory:** (deixe vazio)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Instance Type:** Free

6. **Variáveis de Ambiente** (aba "Environment"):
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

7. Clique em **"Create Web Service"**
8. Aguarde o deploy (5-10 minutos)
9. **Copie a URL** do backend (ex: `https://amigo-oculto-backend.onrender.com`)

### Passo 3: Deploy do Frontend no Render

1. No Render, clique em **"New +"** → **"Static Site"**
2. Conecte o mesmo repositório
3. Configure:
   - **Name:** `amigo-oculto-frontend`
   - **Branch:** `main`
   - **Root Directory:** (deixe vazio)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`

4. **Variável de Ambiente:**
   ```
   VITE_API_URL=https://amigo-oculto-backend.onrender.com
   ```
   (Use a URL do seu backend do Passo 2)

5. Clique em **"Create Static Site"**
6. Aguarde o deploy (2-5 minutos)
7. **Sua aplicação estará disponível!** 🎉

---

## 🎯 Alternativa: Vercel (Frontend) + Render (Backend)

### Frontend no Vercel (Mais Rápido)

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Importe seu repositório
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. **Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: `https://amigo-oculto-backend.onrender.com` (URL do seu backend)

7. Clique em **"Deploy"**
8. Pronto! Frontend no ar em segundos! ⚡

---

## ✅ Checklist Final

- [ ] Backend deployado e funcionando
- [ ] Frontend deployado e funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Teste: Acesse o frontend e faça um sorteio de teste
- [ ] Verifique se os emails estão sendo enviados

---

## 🔧 Troubleshooting

### Backend não inicia
- Verifique os logs no Render
- Confirme que todas as variáveis estão configuradas
- Verifique se o build está funcionando localmente

### Frontend não conecta ao backend
- Confirme que `VITE_API_URL` está configurada
- Verifique CORS no backend (já está habilitado no código)
- Teste a URL do backend diretamente no navegador

### Erro de CORS
O código já tem `app.enableCors()` habilitado. Se ainda tiver problemas, adicione no `src/main.ts`:

```typescript
app.enableCors({
  origin: '*', // Em produção, especifique o domínio do frontend
  credentials: true,
});
```

---

## 🎉 Pronto!

Sua aplicação está no ar! Compartilhe a URL do frontend com seus amigos! 🚀

