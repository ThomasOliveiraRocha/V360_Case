#  V360 Kanban - Sistema de Gerenciamento de Tarefas

> Projeto desenvolvido como parte do **desafio técnico da Visagio**

Uma aplicação de gerenciamento de tarefas estilo Kanban, com listas, cards, checklists e atribuição de usuários.

[![Demo Video]](https://drive.google.com/file/d/1jLfu5iv8eFUOvGapDVK5y77SHjTub0cz/view?usp=sharing)

---

##  Funcionalidades

-  **CRUD completo** de Listas e Cards
-  **Checklists** interativas dentro dos cards
-  **Atribuição de usuários** para cards e itens de checklist
-  **Drag & Drop** intuitivo para listas e cards
-  **Design responsivo** para todos os dispositivos
-  **Modo claro/escuro** para melhor experiência
-  **Interface moderna** com React e CSS puro

---

##  Tecnologias

### Backend
- **Framework**: Flask + SQLAlchemy
- **Banco de Dados**: PostgreSQL
- **Migrações**: Flask-Migrate
- **CORS**: Flask-CORS
- **Configuração**: python-dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Estilização**: CSS puro com variáveis customizadas
- **Estado**: React Hooks nativo
- **Drag & Drop**: @hello-pangea/dnd

### DevOps
- **Containerização**: Docker + Docker Compose
- **Proxy Reverso**: Nginx

---

##  Setup Rápido com Docker (Recomendado)

### Pré-requisitos
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone e execute

```bash
git clone https://github.com/ThomasOliveiraRocha/V360_Case.git
cd V360_Case
```

### 2. Crie o arquivo de variáveis de ambiente na pasta backend.

```bash
cd backend
cp .env.example .env
cd ..
```

### 3. Execute tudo com um comando

```bash
docker-compose up --build
```

 **Pronto!** Acesse: http://localhost:3000/

### Comandos úteis do Docker

```bash
# Executar em background
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Parar serviços
docker-compose down

# Limpar tudo (incluindo dados)
docker-compose down -v

# Rebuild apenas a aplicação
docker-compose build app && docker-compose up -d app
```

---

##  Setup Local (Desenvolvimento)

<details>
<summary>Clique para expandir instruções detalhadas</summary>

### Backend

1. **Clone e navegue para o backend**
```bash
git clone https://github.com/ThomasOliveiraRocha/V360_Case.git
cd V360_Case/backend
```

2. **Crie o ambiente virtual**
```bash
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/macOS
source venv/bin/activate
```

3. **Instale dependências**
```bash
pip install -r requirements.txt
```

4. **Configure variáveis de ambiente**
```bash
# Crie o arquivo .env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/v360_kanban
SECRET_KEY=sua-chave-secreta
```

5. **Configure o banco de dados**
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
python setup.py  # Dados iniciais
```

6. **Execute a API**
```bash
python app.py
```

### Frontend

1. **Navegue para o frontend**
```bash
cd ../frontend
```

2. **Instale dependências**
```bash
npm install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
```

</details>

---

##  Arquitetura do Sistema

```
                ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
                │                 │    │                 │    │                 │
                │   React Frontend│────│  Flask API      │────│   PostgreSQL    │
                │   (Port 3000)   │    │  (Port 5000)    │    │   (Port 5432)   │
                │                 │    │                 │    │                 │
                └─────────────────┘    └─────────────────┘    └─────────────────┘
                        │                       │                       │
                        │              ┌─────────────────┐              │
                        └──────────────│  Nginx Proxy    │──────────────┘
                                        │  (Port 80)      │
                                        └─────────────────┘
```

![Diagrama da Arquitetura](./diagrama.svg)

---

##  Endpoints da API

<details>
<summary>Ver documentação da API</summary>

### Listas
- `GET /api/lists` - Listar todas as listas
- `POST /api/lists` - Criar nova lista
- `PUT /api/lists/{id}` - Atualizar lista
- `DELETE /api/lists/{id}` - Deletar lista

### Cards
- `GET /api/cards` - Listar todos os cards
- `POST /api/cards` - Criar novo card
- `PUT /api/cards/{id}` - Atualizar card
- `DELETE /api/cards/{id}` - Deletar card

### Checklists
- `GET /api/checklists/{card_id}` - Listar checklist do card
- `POST /api/checklists` - Criar item de checklist
- `PUT /api/checklists/{id}` - Atualizar item
- `DELETE /api/checklists/{id}` - Deletar item

</details>

---

##  Estrutura do Projeto

```
V360_Case/
├── backend/
│   ├── app.py                # App Flask principal
│   ├── models.py             # Modelos SQLAlchemy
│   ├── routes.py             # Rotas da API
│   ├── seed.py               # Seed do banco
│   ├── setup.py              # Setup: migração + seed
│   ├── requirements.txt      # Dependências Python
│   ├── Dockerfile            # Imagem backend
│   └── .env.example          # Exemplo de env
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── context/          # Context API
│   │   └── services/         # Comunicação API
│   ├── public/               # Assets e index.html
│   ├── App.jsx
│   ├── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile            # imagem frontend
├── nginx/
│   ├── nginx.conf            # Configuração do proxy
│   └── Dockerfile            # Imagem do Nginx
├── docker-compose.yml        # Orquestração dos containers
├── README.md                 # Este arquivo
└── diagrama.svg              # Diagrama da arquitetura
```

---

##  Configuração de Ambiente

### Variáveis de Ambiente (.env)

```env
# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@postgres:5432/v360_kanban
DB_HOST=postgres
DB_PORT=5432
DB_USER=usuario
DB_PASSWORD=senha
DB_NAME=v360_kanban
```

---
<div align="center">
  <p>Desenvolvido para o desafio técnico da Visagio</p>

</div>
