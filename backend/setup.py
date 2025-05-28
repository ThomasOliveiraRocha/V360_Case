from app import app
import subprocess

def run_migrations():
    print("🚀 Executando migrações...")
    subprocess.run(["flask", "db", "upgrade"])

def seed_db():
    print("🌱 Populando banco de dados...")
    from seed import seed
    seed()

if __name__ == '__main__':
    run_migrations()
    seed_db()
    print("🎉 Setup completo!")
