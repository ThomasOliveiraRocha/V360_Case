from flask import Flask, jsonify
from flask_migrate import Migrate, upgrade
from flask_cors import CORS
from models import db
from routes import api_bp
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔗 Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o banco
db.init_app(app)

# Inicializa o Migrate
migrate = Migrate(app, db)

# 🚀 Executa as migrations automaticamente no startup
with app.app_context():
    print("🚀 Executando migrações no startup...")
    upgrade()

# Registrar as rotas
app.register_blueprint(api_bp)

# Tratamento de erros
@app.errorhandler(404)
def not_found(e):
    return jsonify({'status': 'error', 'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=False)  # 🔥 Debug sempre False em produção
