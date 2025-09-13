// Copie e cole este código completo no arquivo: api/avaliacoes.ts

import { sql } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Esta é a nossa "Serverless Function" para buscar dados.
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Garante que só aceitamos o método GET, que é usado para pedir informações
  if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Pega o ID do local que foi enviado na URL 
    // Exemplo: /api/avaliacoes?poiId=12345
    const poiId = request.query.poiId as string;

    // Se o ID não foi enviado, retorna um erro
    if (!poiId) {
      return response.status(400).json({ error: 'O ID do local é obrigatório.' });
    }

    // Busca no banco de dados todas as avaliações que correspondem ao poiId
    // Ordena pelas mais recentes primeiro
    const { rows: avaliacoes } = await sql`
      SELECT Rating, Review, UserEmail, CriadoEm 
      FROM Avaliacoes 
      WHERE PoiId = ${poiId}
      ORDER BY CriadoEm DESC; 
    `;
    
    // Se tudo deu certo, envia a lista de avaliações encontradas de volta para o site
    return response.status(200).json(avaliacoes);

  } catch (error: any) {
    // Se der algum erro (como a tabela ainda não existir), ele captura o erro
    console.error(error);
    
    // CORREÇÃO IMPORTANTE: Se o erro for "tabela não existe"...
    if (error.message.includes('relation "avaliacoes" does not exist')) {
      // ...em vez de quebrar, ele responde com uma lista vazia, o que é seguro.
      return response.status(200).json([]);
    }
    
    // Para qualquer outro erro, ele avisa que deu problema.
    return response.status(500).json({ error: error.message });
  }
}