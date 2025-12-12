import axios from 'axios';

const participants = [
  { nickname: 'João Grandão', email: 'joaomarcosjmos.ans@gmail.com', partnerEmail: 'camilla.uva@gmail.com' },
  { nickname: 'Bea Rainha Cabeçuda', email: 'bia.oliveira9810@gmail.com', partnerEmail: 'matheus25almeida@gmail.com' },
  { nickname: 'Matheus o Grande', email: 'matheus25almeida@gmail.com', partnerEmail: 'bia.oliveira9810@gmail.com' },
  { nickname: 'Leandro dançarino', email: 'leandrohenrique90brandao@gmail.com', partnerEmail: 'jeh.brandao.055@gmail.com' },
  { nickname: 'Jessica hamburgue', email: 'jeh.brandao.055@gmail.com', partnerEmail: 'leandrohenrique90brandao@gmail.com' },
  { nickname: 'Camilla p PUUUM!', email: 'camilla.uva@gmail.com', partnerEmail: 'joaomarcosjmos.ans@gmail.com' },
  { nickname: 'Larissa gorfada', email: 'larissal.chaves.publi@gmail.com', partnerEmail: 'williammota.david@gmail.com' },
  { nickname: 'Willian fiapo de manga', email: 'williammota.david@gmail.com', partnerEmail: 'larissal.chaves.publi@gmail.com' },
];

async function runDraw() {
  try {
    console.log('🎁 Iniciando sorteio do Amigo Oculto...\n');
    console.log(`Participantes: ${participants.length}\n`);

    const response = await axios.post('http://localhost:3000/secret-santa/draw', {
      participants,
      organizerEmail: 'joaomarcosjmos.ans@gmail.com',
    });

    console.log('✅ Sorteio realizado com sucesso!\n');
    console.log('Resultados:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('❌ Erro ao realizar sorteio:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

runDraw();

