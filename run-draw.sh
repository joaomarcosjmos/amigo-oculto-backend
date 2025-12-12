#!/bin/bash

echo "🎁 Iniciando sorteio do Amigo Oculto..."
echo ""

curl -X POST http://localhost:3000/secret-santa/draw \
  -H "Content-Type: application/json" \
  -d '{
    "participants": [
      {"nickname": "João Grandão", "email": "joaomarcosjmos.ans@gmail.com", "partnerEmail": "camilla.uva@gmail.com"},
      {"nickname": "Bea Rainha Cabeçuda", "email": "bia.oliveira9810@gmail.com", "partnerEmail": "matheus25almeida@gmail.com"},
      {"nickname": "Matheus o Grande", "email": "matheus25almeida@gmail.com", "partnerEmail": "bia.oliveira9810@gmail.com"},
      {"nickname": "Leandro dançarino", "email": "leandrohenrique90brandao@gmail.com", "partnerEmail": "jeh.brandao.055@gmail.com"},
      {"nickname": "Jessica hamburgue", "email": "jeh.brandao.055@gmail.com", "partnerEmail": "leandrohenrique90brandao@gmail.com"},
      {"nickname": "Camilla p PUUUM!", "email": "camilla.uva@gmail.com", "partnerEmail": "joaomarcosjmos.ans@gmail.com"},
      {"nickname": "Larissa gorfada", "email": "larissal.chaves.publi@gmail.com", "partnerEmail": "williammota.david@gmail.com"},
      {"nickname": "Willian fiapo de manga", "email": "williammota.david@gmail.com", "partnerEmail": "larissal.chaves.publi@gmail.com"}
    ],
    "organizerEmail": "joaomarcosjmos.ans@gmail.com"
  }' | jq '.'

echo ""
echo "✅ Sorteio concluído!"
