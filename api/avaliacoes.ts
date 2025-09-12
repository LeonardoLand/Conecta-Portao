// Conteúdo para o arquivo: api/avaliacoes.ts
import { sql } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Garante que só aceitamos o método GET, para buscar dados
  if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Pega o ID do local que foi enviado na URL (ex: /api/avaliacoes?poiId=12345)
    const poiId = request.query.poiId as string;

    if (!poiId) {
      return response.status(400).json({ error: 'O ID do local é obrigatório.' });
    }

    // Busca no banco de dados todas as avaliações que correspondem ao poiId
    const { rows: avaliacoes } = await sql`
      SELECT Rating, Review, UserEmail, CriadoEm 
      FROM Avaliacoes 
      WHERE PoiId = ${poiId}
      ORDER BY CriadoEm DESC; 
    `;

    // Se tudo deu certo, envia a lista de avaliações encontradas
    return response.status(200).json(avaliacoes);

  } catch (error: any) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}