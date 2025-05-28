from flask import Blueprint, request, jsonify
from models import db, List, Card, ChecklistItem, User, ActionHistory
from datetime import datetime

api_bp = Blueprint('api', __name__)


def log_action(user, action, resource_id=None, resource_type=None):
    history = ActionHistory(
        user=user,
        action=action,
        timestamp=datetime.utcnow(),
        resource_id=resource_id,
        resource_type=resource_type
    )
    db.session.add(history)
    db.session.commit()


# 🔸 Listas
@api_bp.route('/lists', methods=['GET'])
def get_lists():
    lists = List.query.order_by(List.position).all()
    return jsonify([
        {
            'id': l.id,
            'title': l.title,
            'cards': [
                {
                    'id': c.id,
                    'title': c.title,
                    'description': c.description,
                    'assigned_user_id': c.assigned_user_id,
                    'assigned_user_name': c.assigned_user.name if c.assigned_user else None,
                    'checklist': [
                        {
                            'id': item.id,
                            'text': item.text,
                            'done': item.done,
                            'assigned_user_id': item.assigned_user_id,
                            'assigned_user_name': item.assigned_user.name if item.assigned_user else None
                        } for item in c.checklist_items
                    ]
                } for c in l.cards
            ]
        } for l in lists
    ])
    
@api_bp.route('/lists/<int:list_id>/move', methods=['PUT'])
def move_list(list_id):
    data = request.json
    user = data.get('user', 'Sistema')
    new_position = data.get('new_position')

    if new_position is None:
        return jsonify({'error': 'Nova posição é obrigatória'}), 400

    lista = List.query.get_or_404(list_id)

    lists = List.query.order_by(List.position).all()

    lists.remove(lista)

    lists.insert(new_position, lista)

    for index, l in enumerate(lists):
        l.position = index

    db.session.commit()

    log_action(user, f"Moveu a lista '{lista.title}' para a posição {new_position}", lista.id, 'list')

    return jsonify({'message': 'Lista movida com sucesso'})

@api_bp.route('/cards/<int:card_id>/move', methods=['PUT'])
def move_card(card_id):
    data = request.get_json()
    new_list_id = data.get('list_id')

    if not new_list_id:
        return jsonify({'error': 'list_id é obrigatório'}), 400

    card = Card.query.get_or_404(card_id)
    card.list_id = new_list_id
    db.session.commit()

    return jsonify({'message': 'Card movido com sucesso', 'card_id': card.id, 'new_list_id': new_list_id})





@api_bp.route('/lists', methods=['POST'])
def create_list():
    data = request.json
    title = data.get('title')
    user = data.get('user', 'Sistema')

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    new_list = List(title=title)
    db.session.add(new_list)
    db.session.commit()

    log_action(user, f"Criou a lista '{title}'", new_list.id, 'list')

    return jsonify({'id': new_list.id, 'title': new_list.title}), 201

@api_bp.route('/lists/<int:list_id>', methods=['PUT'])
def update_list(list_id):
    data = request.json
    user = data.get('user', 'Sistema')

    lista = List.query.get_or_404(list_id)
    old_title = lista.title

    lista.title = data.get('title', lista.title)
    db.session.commit()

    log_action(user, f"Renomeou a lista de '{old_title}' para '{lista.title}'", list_id, 'list')

    return jsonify({'id': lista.id, 'title': lista.title})



@api_bp.route('/lists/<int:list_id>', methods=['DELETE'])
def delete_list(list_id):
    user = request.args.get('user', 'Sistema')

    lista = List.query.get(list_id)
    if not lista:
        return jsonify({'error': 'List not found'}), 404

    db.session.delete(lista)
    db.session.commit()

    log_action(user, f"Deletou a lista '{lista.title}'", list_id, 'list')

    return jsonify({'message': 'List deleted'})





# 🔸 Cards
@api_bp.route('/lists/<int:list_id>/cards', methods=['POST'])
def add_card(list_id):
    data = request.json
    user = data.get('user', 'Sistema')

    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400

    card = Card(
        title=data['title'],
        description=data.get('description', ''),
        assigned_user_id=data.get('assigned_user_id'),
        list_id=list_id
    )
    db.session.add(card)
    db.session.commit()

    log_action(user, f"Adicionou o card '{card.title}' na lista {list_id}", card.id, 'card')

    return jsonify({
        'id': card.id,
        'title': card.title,
        'description': card.description,
        'assigned_user_id': card.assigned_user_id
    })

@api_bp.route('/cards', methods=['GET'])
def get_cards():
    cards = Card.query.all()
    return jsonify([
        {
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'list_id': c.list_id,
            'list_title': c.lista.title if c.lista else None,
            'assigned_user_id': c.assigned_user_id,
            'assigned_user_name': c.assigned_user.name if c.assigned_user else None,
            'checklist': [
                {
                    'id': item.id,
                    'text': item.text,
                    'done': item.done,
                    'assigned_user_id': item.assigned_user_id,
                    'assigned_user_name': item.assigned_user.name if item.assigned_user else None
                } for item in c.checklist_items
            ]
        } for c in cards
    ])



@api_bp.route('/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    data = request.json
    user = data.get('user', 'Sistema')

    card = Card.query.get_or_404(card_id)
    old_list = card.list_id
    new_list = data.get('new_list_id', old_list)

    card.title = data.get('title', card.title)
    card.description = data.get('description', card.description)
    card.assigned_user_id = data.get('assigned_user_id', card.assigned_user_id)
    card.list_id = new_list

    db.session.commit()

    action_message = (
        f"Atualizou o card '{card.title}' (mudou da lista {old_list} para {new_list})"
        if old_list != new_list else
        f"Atualizou o card '{card.title}'"
    )
    log_action(user, action_message, card.id, 'card')

    return jsonify({
        'id': card.id,
        'title': card.title,
        'description': card.description,
        'assigned_user_id': card.assigned_user_id,
        'list_id': card.list_id
    })


@api_bp.route('/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    user = request.args.get('user', 'Sistema')

    card = Card.query.get(card_id)
    if not card:
        return jsonify({'message': 'Card já não existia'}), 200  # ✅ Retorna 200

    db.session.delete(card)
    db.session.commit()

    log_action(user, f"Deletou o card '{card.title}'", card_id, 'card')

    return jsonify({'message': 'Card deletado'})




# 🔸 Checklist
@api_bp.route('/cards/<int:card_id>/checklist', methods=['POST'])
def add_checklist_item(card_id):
    data = request.json
    user = data.get('user', 'Sistema')

    if not data.get('text'):
        return jsonify({'error': 'Texto é obrigatório'}), 400

    item = ChecklistItem(
        text=data['text'],
        done=False,
        card_id=card_id,
        assigned_user_id=data.get('assigned_user_id')
    )
    db.session.add(item)
    db.session.commit()

    log_action(user, f"Adicionou o item '{item.text}' no checklist do card {card_id}", card_id, 'checklist')

    return jsonify({
        'id': item.id,
        'text': item.text,
        'done': item.done,
        'assigned_user_id': item.assigned_user_id
    }), 201


@api_bp.route('/checklist/<int:item_id>', methods=['PUT'])
def update_checklist_item(item_id):
    data = request.json
    user = data.get('user', 'Sistema')

    item = ChecklistItem.query.get_or_404(item_id)
    item.text = data.get('text', item.text)
    item.done = bool(data.get('done', item.done))

    item.assigned_user_id = data.get('assigned_user_id', item.assigned_user_id)

    db.session.commit()

    log_action(user, f"Atualizou o item '{item.text}' do checklist", item.card_id, 'checklist')

    return jsonify({
        'id': item.id,
        'text': item.text,
        'done': item.done,
        'assigned_user_id': item.assigned_user_id
    })


@api_bp.route('/checklist/<int:item_id>', methods=['DELETE'])
def delete_checklist_item(item_id):
    user = request.args.get('user', 'Sistema')

    item = ChecklistItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()

    log_action(user, f"Removeu o item '{item.text}' do checklist", item.card_id, 'checklist')

    return jsonify({'message': 'Checklist item deletado'})



# 🔸 Histórico de ações
@api_bp.route('/history', methods=['GET'])
def get_history():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    user = request.args.get('user')
    resource_type = request.args.get('resource_type')

    query = ActionHistory.query

    if user:
        query = query.filter(ActionHistory.user == user)

    if resource_type:
        query = query.filter(ActionHistory.resource_type == resource_type)

    history_paginated = query.order_by(ActionHistory.timestamp.desc()).paginate(
        page=page, per_page=per_page, error_out=False)

    def get_resource_name(resource_type, resource_id):
        if resource_type == 'card':
            card = Card.query.get(resource_id)
            return card.title if card else None
        elif resource_type == 'list':
            lista = List.query.get(resource_id)
            return lista.title if lista else None
        elif resource_type == 'checklist':
            item = ChecklistItem.query.get(resource_id)
            return item.text if item else None
        else:
            return None

    return jsonify({
        'items': [
            {
                'user': h.user,
                'action': h.action,
                'timestamp': h.timestamp.isoformat(),
                'resource_type': h.resource_type,
                'resource_id': h.resource_id,
                'resource_name': get_resource_name(h.resource_type, h.resource_id)
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
        name = data.get('name')

        if not name:
            return jsonify({'error': 'Name is required'}), 400

        user = User(name=name)
        db.session.add(user)
        db.session.commit()
        return jsonify({'id': user.id, 'name': user.name})

@api_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)

    # 🔸 Remove a referência do usuário em cards
    cards = Card.query.filter_by(assigned_user_id=user.id).all()
    for card in cards:
        card.assigned_user_id = None

    # 🔸 Remove a referência do usuário em checklist items
    items = ChecklistItem.query.filter_by(assigned_user_id=user.id).all()
    for item in items:
        item.assigned_user_id = None

    db.session.delete(user)
    db.session.commit()

    log_action('Sistema', f"Deletou o usuário '{user.name}'", user_id, 'user')

    return jsonify({'message': f'Usuário {user.name} deletado com sucesso'})
