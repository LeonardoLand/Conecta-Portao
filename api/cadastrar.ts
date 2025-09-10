// Importa as ferramentas que vamos usar
import { sql } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Esta é a nossa "Serverless Function".
// Ela recebe os dados do site e conversa com o banco de dados.
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Garante que só aceitamos requisições do tipo POST (envio de formulário)
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Pega os dados que o formulário de cadastro enviou
    const { nome, email, senha } = request.body;

    // Verifica se todos os campos foram preenchidos
    if (!nome || !email || !senha) {
      return response.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Cria a tabela de usuários no banco de dados se ela ainda não existir.
    // Isso só acontece na primeira vez que alguém se cadastra.
    await sql`
      CREATE TABLE IF NOT EXISTS Usuarios (
        Id SERIAL PRIMARY KEY,
        Nome VARCHAR(255) NOT NULL,
        Email VARCHAR(255) UNIQUE NOT NULL,
        Senha VARCHAR(255) NOT NULL,
        CriadoEm TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insere o novo usuário na tabela "Usuarios".
    await sql`
      INSERT INTO Usuarios (Nome, Email, Senha)
      VALUES (${nome}, ${email}, ${senha});
    `;
    
    // Se tudo deu certo, envia uma resposta de sucesso.
    return response.status(200).json({ message: 'Usuário cadastrado com sucesso!' });

  } catch (error: any) {
    // Se der algum erro (como um email que já existe), envia uma mensagem de erro.
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}