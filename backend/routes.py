from flask import Blueprint, request, jsonify
from models import db, List, Card, ActionHistory, User, ChecklistItem
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
                    'assigned_user': c.assigned_user,
                    'checklist': [
                        {
                            'id': item.id,
                            'text': item.text,
                            'done': item.done,
                            'assigned_user': item.assigned_user
                        } for item in c.checklist_items
                    ]
                } for c in l.cards
            ]
        } for l in lists
    ])


@api_bp.route('/lists', methods=['POST'])
def create_list():
    data = request.json
    title = data.get('title')
    if not title:
        return jsonify({'error': 'Title is required'}), 400

    new_list = List(title=title)
    db.session.add(new_list)
    db.session.commit()

    log_action(data.get('user', 'Sistema'), f"Criou a lista '{title}'")

    return jsonify({'id': new_list.id, 'title': new_list.title}), 201


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
def update_card(card_id):
    data = request.json
    card = Card.query.get_or_404(card_id)

    old_list = card.list_id
    new_list = data.get('new_list_id', old_list)

    card.title = data.get('title', card.title)
    card.description = data.get('description', card.description)
    card.assigned_user = data.get('assigned_user', card.assigned_user)
    card.list_id = new_list

    db.session.commit()

    log_action(
        data.get('user', 'Sistema'),
        f"Atualizou o card '{card.title}' (mudou de lista {old_list} para {new_list})"
        if old_list != new_list
        else f"Atualizou o card '{card.title}'"
    )

    return jsonify({
        'id': card.id,
        'title': card.title,
        'description': card.description,
        'assigned_user': card.assigned_user,
        'list_id': card.list_id
    })


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
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    history_paginated = ActionHistory.query.order_by(ActionHistory.timestamp.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'items': [
            {
                'user': h.user,
                'action': h.action,
                'timestamp': h.timestamp.isoformat()
            } for h in history_paginated.items
        ],
        'total': history_paginated.total,
        'page': history_paginated.page,
        'pages': history_paginated.pages
    })


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

@api_bp.route('/cards/<int:card_id>/checklist', methods=['GET'])
def get_checklist(card_id):
    items = ChecklistItem.query.filter_by(card_id=card_id).all()
    return jsonify([
        {
            'id': item.id,
            'text': item.text,
            'done': item.done,
            'assigned_user': item.assigned_user
        } for item in items
    ])
    
@api_bp.route('/cards/<int:card_id>/checklist', methods=['POST'])
def add_checklist_item(card_id):
    data = request.json
    text = data.get('text')
    assigned_user = data.get('assigned_user')

    if not text:
        return jsonify({'error': 'Texto é obrigatório'}), 400

    item = ChecklistItem(
        text=text,
        done=False,
        card_id=card_id,
        assigned_user=assigned_user
    )
    db.session.add(item)
    db.session.commit()

    log_action(data.get('user', 'Sistema'), f"Adicionou o item '{text}' no checklist do card {card_id}")

    return jsonify({
        'id': item.id,
        'text': item.text,
        'done': item.done,
        'assigned_user': item.assigned_user
    }), 201
    
@api_bp.route('/checklist/<int:item_id>', methods=['DELETE'])
def delete_checklist_item(item_id):
    item = ChecklistItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    log_action('Sistema', f"Removeu o item '{item.text}' do checklist")
    return jsonify({'message': 'Checklist item deleted'})


@api_bp.route('/checklist/<int:item_id>', methods=['PUT'])
def update_checklist_item(item_id):
    data = request.json
    item = ChecklistItem.query.get_or_404(item_id)

    item.text = data.get('text', item.text)
    item.done = data.get('done', item.done)
    item.assigned_user = data.get('assigned_user', item.assigned_user)

    db.session.commit()

    log_action(data.get('user', 'Sistema'), f"Atualizou o item '{item.text}' do checklist")

    return jsonify({
        'id': item.id,
        'text': item.text,
        'done': item.done,
        'assigned_user': item.assigned_user
    })

