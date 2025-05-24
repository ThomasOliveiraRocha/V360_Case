from flask import Blueprint, request, jsonify
from models import db, BoardList, Card, ActionHistory, User

api_bp = Blueprint('api', __name__)

def log_action(user, action):
    history = ActionHistory(user=user, action=action)
    db.session.add(history)
    db.session.commit()

@api_bp.route('/lists', methods=['GET'])
def get_lists():
    lists = BoardList.query.all()
    result = []
    for l in lists:
        result.append({
            'id': l.id,
            'name': l.name,
            'cards': [{'id': c.id, 'content': c.content} for c in l.cards]
        })
    return jsonify(result)

@api_bp.route('/lists', methods=['POST'])
def create_list():
    data = request.json
    new_list = BoardList(name=data['name'])
    db.session.add(new_list)
    db.session.commit()
    log_action(data['user'], f"Criou a lista {new_list.name}")
    return jsonify({'id': new_list.id, 'name': new_list.name})

@api_bp.route('/lists/<int:list_id>/cards', methods=['POST'])
def add_card(list_id):
    data = request.json
    new_card = Card(content=data['content'], list_id=list_id)
    db.session.add(new_card)
    db.session.commit()
    log_action(data['user'], f"Adicionou o card '{new_card.content}' na lista {list_id}")
    return jsonify({'id': new_card.id, 'content': new_card.content})

@api_bp.route('/cards/<int:card_id>', methods=['PUT'])
def move_card(card_id):
    data = request.json
    card = Card.query.get_or_404(card_id)
    old_list = card.list_id
    card.list_id = data['new_list_id']
    db.session.commit()
    log_action(data['user'], f"Moveu o card '{card.content}' da lista {old_list} para {data['new_list_id']}")
    return jsonify({'id': card.id, 'content': card.content})

@api_bp.route('/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    data = request.json
    card = Card.query.get_or_404(card_id)
    db.session.delete(card)
    db.session.commit()
    log_action(data['user'], f"Deletou o card '{card.content}'")
    return jsonify({'message': 'Card deleted'})

@api_bp.route('/lists/<int:list_id>', methods=['DELETE'])
def delete_list(list_id):
    data = request.json
    board_list = BoardList.query.get_or_404(list_id)
    db.session.delete(board_list)
    db.session.commit()
    log_action(data['user'], f"Deletou a lista {board_list.name}")
    return jsonify({'message': 'List deleted'})

@api_bp.route('/history', methods=['GET'])
def get_history():
    history = ActionHistory.query.order_by(ActionHistory.timestamp.desc()).all()
    result = [{'user': h.user, 'action': h.action, 'timestamp': h.timestamp} for h in history]
    return jsonify(result)

@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(name=data['name'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id, 'name': user.name})

@api_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'name': u.name} for u in users])