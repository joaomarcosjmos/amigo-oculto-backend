# 📤 Como fazer Push para GitHub

O repositório Git local já foi criado e o commit inicial foi feito! ✅

## Próximos Passos:

### 1. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `amigo-oculto` (ou outro nome de sua preferência)
   - **Description:** `Sistema de sorteio de Amigo Oculto com envio automático de emails`
   - **Visibility:** Escolha Public ou Private
   - **NÃO marque** "Initialize with README" (já temos arquivos)
3. Clique em **"Create repository"**

### 2. Conectar e Fazer Push

Após criar o repositório no GitHub, você verá instruções. Execute estes comandos:

```bash
cd /Users/joaomarcosoliveiradasilva/Development/amigo-oculto

# Adicione o remote (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/amigo-oculto.git

# Ou se preferir SSH:
# git remote add origin git@github.com:SEU_USUARIO/amigo-oculto.git

# Faça o push
git push -u origin main
```

### 3. Verificar

Após o push, acesse seu repositório no GitHub e verifique se todos os arquivos estão lá.

---

## 🚀 Depois do Push

Após fazer o push, você pode seguir o guia `DEPLOY_QUICK.md` para fazer o deploy!

---

## ⚠️ Nota sobre Arquivos Sensíveis

O arquivo `.gitignore` já está configurado para ignorar:
- `.env` (variáveis de ambiente)
- `node_modules/`
- `dist/`
- Logs

**Nunca faça commit de arquivos `.env` com senhas reais!**

