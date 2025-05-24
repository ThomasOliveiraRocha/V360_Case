const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors()); // Permite requests do frontend em outra porta/domínio
app.use(express.json()); // Para ler JSON do body

// Simulando um banco de dados em memória (apenas exemplo)
const lists = {
  1: [], // To Do
  2: [], // Doing
  3: []  // Done
};

// Endpoint para criar card
app.post('/api/lists/:listId/items', (req, res) => {
  const listId = req.params.listId;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Conteúdo do card é obrigatório.' });
  }

  if (!lists[listId]) {
    return res.status(404).json({ error: 'Lista não encontrada.' });
  }

  // Criar o card
  const newCard = {
    id: Date.now().toString(), // id simples usando timestamp
    content: content.trim(),
    createdAt: new Date()
  };

  // Adicionar no array da lista
  lists[listId].push(newCard);

  // Retornar o card criado
  res.status(201).json(newCard);
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
