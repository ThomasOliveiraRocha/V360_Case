from flask import Flask
from flask_cors import CORS
from models import db
from routes import api_bp

app = Flask(__name__)
CORS(app)

# 🔗 Aqui você conecta no PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:senha@localhost:5432/v360_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Criar as tabelas se não existirem
with app.app_context():
    db.create_all()

# Registrar as rotas
app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
