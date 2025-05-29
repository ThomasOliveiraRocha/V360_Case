from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from models import db
from routes import api_bp
from dotenv import load_dotenv
from seeder import run_seed
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

# Registrar as rotas
app.register_blueprint(api_bp)

# Tratamento de erros
@app.errorhandler(404)
def not_found(e):
    return jsonify({'status': 'error', 'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

@app.route('/run-seed')
def run_seed_route():
    try:
        run_seed()
        return jsonify({'message': '🌱 Banco populado com sucesso!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False)
