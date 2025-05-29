
# 📝 ToDo List - API + Frontend + Backend + Python

Projeto desenvolvido como parte do **desafio técnico da Visagio**.  
Uma aplicação de gerenciamento de tarefas estilo Kanban, com listas, cards, checklists e atribuição de usuários.
---

## 🚀 Tecnologias Utilizadas

### Backend
- [Python](https://www.python.org/) + [Flask](https://flask.palletsprojects.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Flask-Migrate](https://flask-migrate.readthedocs.io/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
- [python-dotenv](https://pypi.org/project/python-dotenv/)

### Frontend
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- JavaScript
- CSS puro (sem frameworks)

---

## 🏗️ Funcionalidades
- ✅ CRUD de Listas
- ✅ CRUD de Cards
- ✅ Checklists dentro dos cards
- ✅ Atribuição de usuários tanto aos cards quanto aos itens dos checklists
- ✅ Drag and Drop de listas e cards
- ✅ Histórico de ações (log)
- ✅ Responsivo e com modo claro/escuro

---

## 📦 Setup Local

### 🔧 Backend

1. Clone o repositório e acesse a pasta do backend:

```bash
git clone <repo>
cd backend
```

2. Crie e ative o ambiente virtual:

```bash
python -m venv venv
# No Windows:
.\venv\Scripts\activate
# No Linux/macOS:
source venv/bin/activate
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

4. Configure seu arquivo `.env` (exemplo abaixo):

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/seu_banco
```

5. Crie as tabelas no banco de dados:

```bash
flask db init
flask db migrate
flask db upgrade
```

6. Popule dados iniciais:

```bash
python setup.py
```

7. Rode a API:

```bash
python app.py
```

---

### 🎨 Frontend

1. Acesse a pasta do frontend (ou crie caso não tenha):

```bash
# Se não tiver o projeto ainda:
npm create vite@latest
# Se já tiver, apenas:
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o projeto:

```bash
npm run dev
```

---

## 🗒️ Requirements.txt

```plaintext
flask
flask-cors
flask-sqlalchemy
sqlalchemy
psycopg2-binary
python-dotenv
flask-migrate
```

---

## 📜 Licença

Este projeto é de uso educacional e técnico, desenvolvido para o desafio da Visagio.

---
