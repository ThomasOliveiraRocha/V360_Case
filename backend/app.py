from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, TodoList, Card

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.before_request
def create_tables():
    db.create_all()

@app.route('/users', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        users = User.query.all()
        return jsonify([{'id': u.id, 'name': u.name} for u in users])
    else:
        data = request.json
        user = User(name=data['name'])
        db.session.add(user)
        db.session.commit()
        return jsonify({'id': user.id, 'name': user.name})

@app.route('/lists', methods=['GET', 'POST'])
def lists():
    if request.method == 'GET':
        lists = TodoList.query.all()
        return jsonify([{'id': l.id, 'title': l.title} for l in lists])
    else:
        data = request.json
        todo_list = TodoList(title=data['title'])
        db.session.add(todo_list)
        db.session.commit()
        return jsonify({'id': todo_list.id, 'title': todo_list.title})

@app.route('/cards', methods=['GET', 'POST'])
def cards():
    if request.method == 'GET':
        cards = Card.query.all()
        return jsonify([
            {'id': c.id, 'title': c.title, 'description': c.description, 'list_id': c.list_id}
            for c in cards
        ])
    else:
        data = request.json
        card = Card(title=data['title'], description=data.get('description', ''), list_id=data['list_id'])
        db.session.add(card)
        db.session.commit()
        return jsonify({
            'id': card.id, 'title': card.title,
            'description': card.description, 'list_id': card.list_id
        })

if __name__ == '__main__':
    app.run(debug=True)
