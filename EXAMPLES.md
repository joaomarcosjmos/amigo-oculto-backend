# 📚 Exemplos de Uso

## Exemplo 1: Sorteio Básico

```bash
curl -X POST http://localhost:3000/secret-santa/draw \
  -H "Content-Type: application/json" \
  -d '{
    "emails": [
      "joao@example.com",
      "maria@example.com",
      "pedro@example.com"
    ]
  }'
```

## Exemplo 2: Sorteio com JavaScript (Fetch API)

```javascript
const response = await fetch('http://localhost:3000/secret-santa/draw', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    emails: [
      'joao@example.com',
      'maria@example.com',
      'pedro@example.com',
      'ana@example.com',
    ],
  }),
});

const result = await response.json();
console.log(result);
```

## Exemplo 3: Sorteio com Axios

```javascript
const axios = require('axios');

async function realizarSorteio() {
  try {
    const response = await axios.post('http://localhost:3000/secret-santa/draw', {
      emails: [
        'joao@example.com',
        'maria@example.com',
        'pedro@example.com',
      ],
    });
    
    console.log('Sorteio realizado:', response.data);
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

realizarSorteio();
```

## Exemplo 4: Sorteio com Python

```python
import requests

url = "http://localhost:3000/secret-santa/draw"
data = {
    "emails": [
        "joao@example.com",
        "maria@example.com",
        "pedro@example.com"
    ]
}

response = requests.post(url, json=data)
print(response.json())
```

## Resposta de Sucesso

```json
{
  "success": true,
  "message": "Sorteio realizado e emails enviados com sucesso!",
  "results": [
    {
      "email": "joao@example.com",
      "secretFriend": "maria@example.com"
    },
    {
      "email": "maria@example.com",
      "secretFriend": "pedro@example.com"
    },
    {
      "email": "pedro@example.com",
      "secretFriend": "joao@example.com"
    }
  ],
  "totalParticipants": 3
}
```

## Erros Comuns

### Erro: Menos de 2 participantes
```json
{
  "statusCode": 400,
  "message": ["É necessário pelo menos 2 participantes para o sorteio"],
  "error": "Bad Request"
}
```

### Erro: Emails duplicados
```json
{
  "statusCode": 400,
  "message": ["Os emails devem ser únicos"],
  "error": "Bad Request"
}
```

### Erro: Email inválido
```json
{
  "statusCode": 400,
  "message": ["Cada item deve ser um email válido"],
  "error": "Bad Request"
}
```

