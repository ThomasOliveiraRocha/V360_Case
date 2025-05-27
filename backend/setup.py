from app import app
from models import db
import os
import subprocess

def create_db():
    with app.app_context():
        print("🔨 Criando banco de dados...")
        db.create_all()
        print("✅ Banco criado com sucesso!")

def run_migrations():
    print("🚀 Executando migrações...")
    subprocess.run(["flask", "db", "upgrade"])

def seed_db():
    print("🌱 Populando banco de dados...")
    from seed import seed
    seed()

if __name__ == '__main__':
    create_db()
    run_migrations()
    seed_db()
    print("🎉 Setup completo!")
