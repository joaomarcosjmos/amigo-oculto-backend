# 🎁 Frontend - Amigo Oculto

Frontend React para o sistema de sorteio de Amigo Oculto.

## 🚀 Como executar

### Desenvolvimento

```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

### Build para produção

```bash
npm run build
```

Os arquivos estarão em `dist/`

## 🌐 Deploy

### Vercel (Recomendado - Gratuito)

1. Instale a CLI: `npm i -g vercel`
2. No diretório `frontend`, execute: `vercel`
3. Siga as instruções
4. Configure a variável de ambiente `VITE_API_URL` com a URL da sua API

### Netlify (Gratuito)

1. Conecte seu repositório GitHub
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Adicione variável de ambiente `VITE_API_URL`

### GitHub Pages

1. Instale: `npm install --save-dev gh-pages`
2. Adicione ao `package.json`:
   ```json
   "homepage": "https://seu-usuario.github.io/amigo-oculto",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Execute: `npm run deploy`

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env`:

```env
VITE_API_URL=https://sua-api.com
```

Para desenvolvimento local, deixe vazio ou use `http://localhost:3000`

