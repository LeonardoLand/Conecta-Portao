// Copie e cole este código completo no arquivo: api/avaliar.ts

import { sql } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Esta é a nossa "Serverless Function" para SALVAR uma nova avaliação.
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Garante que só aceitamos o método POST, usado para enviar dados
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Pega os dados que o formulário de avaliação enviou
    const { poiId, poiName, userEmail, rating, review } = request.body;

    // Se algum dado essencial estiver faltando, retorna um erro
    if (!poiId || !userEmail || !rating) {
      return response.status(400).json({ error: 'Dados da avaliação estão incompletos.' });
    }

    // Cria a tabela de avaliações no banco de dados se ela ainda não existir.
    // Este comando só tem efeito na primeira vez que a API é chamada.
    await sql`
      CREATE TABLE IF NOT EXISTS Avaliacoes (
        Id SERIAL PRIMARY KEY,
        PoiId VARCHAR(255) NOT NULL,
        PoiName VARCHAR(255),
        UserEmail VARCHAR(255) NOT NULL,
        Rating INT NOT NULL,
        Review TEXT,
        CriadoEm TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insere a nova avaliação na tabela "Avaliacoes".
    await sql`
      INSERT INTO Avaliacoes (PoiId, PoiName, UserEmail, Rating, Review)
      VALUES (${String(poiId)}, ${poiName}, ${userEmail}, ${rating}, ${review});
    `;
    
    // Se tudo deu certo, envia uma resposta de sucesso.
    return response.status(200).json({ message: 'Avaliação registrada com sucesso!' });
    
  } catch (error: any) {
    // Se der qualquer outro erro, envia uma mensagem
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}