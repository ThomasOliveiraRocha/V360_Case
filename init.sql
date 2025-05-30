-- Script de inicialização do banco de dados
-- Este arquivo será executado automaticamente quando o container do PostgreSQL iniciar

-- Criar usuário e banco se não existirem
CREATE DATABASE v360_kanban;

CREATE USER v360_user WITH PASSWORD 'v360_password';

GRANT ALL PRIVILEGES ON DATABASE v360_kanban TO v360_user;

-- Conectar ao banco e configurar permissões
\c v360_kanban;

GRANT ALL ON SCHEMA public TO v360_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO v360_user;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO v360_user;