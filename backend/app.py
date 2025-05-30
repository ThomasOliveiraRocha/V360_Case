from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from models import db
from routes import api_bp
from dotenv import load_dotenv
from seed import seed
import os

load_dotenv()

app = Flask(__name__)
CORS(app)



app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)


migrate = Migrate(app, db)

app.register_blueprint(api_bp)


@app.errorhandler(404)
def not_found(e):
    return jsonify({'status': 'error', 'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

@app.route('/run-seed')
def run_seed_route():
    try:
        seed()
        return jsonify({'message': ' Banco populado com sucesso!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False)
