from flask import Blueprint, request, jsonify
from models import db, TodoList, TodoItem

api_bp = Blueprint('api', __name__)

# ✅ Listar todas as listas
@api_bp.route('/lists', methods=['GET'])
def get_lists():
    lists = TodoList.query.all()
    result = []
    for l in lists:
        result.append({
            'id': l.id,
            'name': l.name,
            'items': [
                {'id': item.id, 'content': item.content, 'completed': item.completed}
                for item in l.items
            ]
        })
    return jsonify(result)

# ✅ Criar uma nova lista
@api_bp.route('/lists', methods=['POST'])
def create_list():
    data = request.json
    new_list = TodoList(name=data['name'])
    db.session.add(new_list)
    db.session.commit()
    return jsonify({'id': new_list.id, 'name': new_list.name})

# ✅ Adicionar item à lista
@api_bp.route('/lists/<int:list_id>/items', methods=['POST'])
def add_item(list_id):
    data = request.json
    new_item = TodoItem(content=data['content'], list_id=list_id)
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'id': new_item.id, 'content': new_item.content, 'completed': new_item.completed})

# ✅ Atualizar status (completo/incompleto)
@api_bp.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    item = TodoItem.query.get_or_404(item_id)
    data = request.json
    item.completed = data.get('completed', item.completed)
    db.session.commit()
    return jsonify({'id': item.id, 'content': item.content, 'completed': item.completed})

# ✅ Deletar item
@api_bp.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = TodoItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted'})

# ✅ Deletar lista
@api_bp.route('/lists/<int:list_id>', methods=['DELETE'])
def delete_list(list_id):
    todo_list = TodoList.query.get_or_404(list_id)
    db.session.delete(todo_list)
    db.session.commit()
    return jsonify({'message': 'List deleted'})
