from models import db, User, List, Card
from app import app

with app.app_context():
    Card.query.delete()
    List.query.delete()
    User.query.delete()

    users = [
    User(name='Thomas'),
    User(name='Larissa'),
    User(name='Lucas')
]

    db.session.add_all(users)

    lists = [
    List(title='A Fazer'),
    List(title='Em Progresso'),
    List(title='Concluído')
]

    db.session.add_all(lists)

    cards = [
    Card(title='Criar interface', list_id=1, assigned_user='Thomas'),
    Card(title='Fazer backend', list_id=2, assigned_user='Larissa'),
    Card(title='Testar', list_id=3, assigned_user='')
]
    db.session.add_all(cards)

    db.session.commit()

    print("✅ Banco populado com sucesso!")
