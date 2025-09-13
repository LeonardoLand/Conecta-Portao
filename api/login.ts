// Conteúdo para o arquivo: api/login.ts
import { sql } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { email, senha } = request.body;

    if (!email || !senha) {
      return response.status(400).json({ error: 'Email and senha são obrigatórios.' });
    }

    // Busca no banco de dados por um usuário com o email fornecido
    const { rows } = await sql`
      SELECT * FROM Usuarios WHERE Email = ${email};
    `;

    // Verifica se o usuário foi encontrado
    if (rows.length === 0) {
      return response.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const usuario = rows[0];

    // Compara a senha fornecida com a senha salva no banco
    if (usuario.senha !== senha) {
      return response.status(401).json({ error: 'Senha incorreta.' });
    }

    // Se a senha estiver correta, retorna os dados do usuário (sem a senha!)
    const usuarioParaRetornar = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
    };

    return response.status(200).json(usuarioParaRetornar);

  } catch (error: any) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}