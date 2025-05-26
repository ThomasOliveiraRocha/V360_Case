from flask import Blueprint, request, jsonify
from models import db, List, Card, ActionHistory, User
from datetime import datetime

api_bp = Blueprint('api', __name__)

def log_action(user, action):
    history = ActionHistory(user=user, action=action, timestamp=datetime.utcnow())
    db.session.add(history)
    db.session.commit()

# 🔸 Rotas de Listas
@api_bp.route('/lists', methods=['GET'])
def get_lists():
    lists = List.query.all()
    return jsonify([
        {
            'id': l.id,
            'title': l.title,
            'cards': [
                {
                    'id': c.id,
                    'title': c.title,
                    'description': c.description,
                    'assigned_user': c.assigned_user
                } for c in l.cards
            ]
        } for l in lists
    ])

@api_bp.route('/lists', methods=['POST'])
def create_list():
    data = request.json
    new_list = List(title=data['title'])
    db.session.add(new_list)
    db.session.commit()
    log_action(data.get('user', 'Sistema'), f"Criou a lista {new_list.title}")
    return jsonify({'id': new_list.id, 'title': new_list.title})

@api_bp.route('/lists/<int:list_id>', methods=['DELETE'])
def delete_list(list_id):
    data = request.json
    lista = List.query.get_or_404(list_id)
    db.session.delete(lista)
    db.session.commit()
    log_action(data.get('user', 'Sistema'), f"Deletou a lista {lista.title}")
    return jsonify({'message': 'List deleted'})

# 🔸 Rotas de Cards
@api_bp.route('/lists/<int:list_id>/cards', methods=['POST'])
def add_card(list_id):
    data = request.json
    card = Card(
        title=data['title'],
        description=data.get('description', ''),
        assigned_user=data.get('assigned_user', 'Não atribuído'),
        list_id=list_id
    )
    db.session.add(card)
    db.session.commit()
    log_action(data.get('user', 'Sistema'), f"Adicionou o card '{card.title}' na lista {list_id}")
    return jsonify({
        'id': card.id,
        'title': card.title,
        'description': card.description,
        'assigned_user': card.assigned_user
    })

@api_bp.route('/cards/<int:card_id>', methods=['PUT'])
def move_card(card_id):
    data = request.json
    card = Card.query.get_or_404(card_id)
    old_list = card.list_id
    card.list_id = data['new_list_id']
    db.session.commit()
    log_action(data.get('user', 'Sistema'), f"Moveu o card '{card.title}' da lista {old_list} para {data['new_list_id']}")
    return jsonify({'message': 'Card moved'})

@api_bp.route('/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    data = request.json
    card = Card.query.get_or_404(card_id)
    db.session.delete(card)
    db.session.commit()
    log_action(data.get('user', 'Sistema'), f"Deletou o card '{card.title}'")
    return jsonify({'message': 'Card deleted'})

# 🔸 Histórico de ações
@api_bp.route('/history', methods=['GET'])
def get_history():
    history = ActionHistory.query.order_by(ActionHistory.timestamp.desc()).all()
    return jsonify([
        {
            'user': h.user,
            'action': h.action,
            'timestamp': h.timestamp.isoformat()
        } for h in history
    ])

# 🔸 Usuários
@api_bp.route('/users', methods=['GET', 'POST'])
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
