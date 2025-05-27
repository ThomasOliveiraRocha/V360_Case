from models import db, User, List, Card, ChecklistItem
from app import app


def seed():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Usuários
        thomas = User(name='Thomas')
        larissa = User(name='Larissa')
        maria = User(name='Maria')

        db.session.add_all([thomas, larissa, maria])
        db.session.commit()

        # Listas
        lista_afazer = List(title='A Fazer')
        lista_progresso = List(title='Em Progresso')
        lista_concluido = List(title='Concluído')

        db.session.add_all([lista_afazer, lista_progresso, lista_concluido])
        db.session.commit()

        # Cards
        card1 = Card(
            title='Criar Interface',
            description='Desenvolver a interface do usuário',
            list_id=lista_afazer.id,
            assigned_user_id=thomas.id
        )
        card2 = Card(
            title='Fazer Backend',
            description='Implementar API e Banco de Dados',
            list_id=lista_progresso.id,
            assigned_user_id=larissa.id
        )
        card3 = Card(
            title='Testar Aplicação',
            description='Realizar testes e QA',
            list_id=lista_concluido.id,
            assigned_user_id=None
        )

        db.session.add_all([card1, card2, card3])
        db.session.commit()

        # Checklist do card1
        item1 = ChecklistItem(
            text='Criar wireframe',
            done=False,
            card_id=card1.id,
            assigned_user_id=thomas.id
        )
        item2 = ChecklistItem(
            text='Montar componentes',
            done=False,
            card_id=card1.id,
            assigned_user_id=None
        )

        db.session.add_all([item1, item2])
        db.session.commit()

        print('🌱 Banco populado com sucesso!')
