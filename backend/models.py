from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class List(db.Model):
    __tablename__ = 'lists'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    cards = db.relationship('Card', backref='list', cascade='all, delete-orphan', lazy=True)

class Card(db.Model):
    __tablename__ = 'cards'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    assigned_user = db.Column(db.String(100), nullable=True)
    list_id = db.Column(db.Integer, db.ForeignKey('lists.id'), nullable=False)

class ActionHistory(db.Model):
    __tablename__ = 'action_history'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(100), nullable=False)
    action = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    resource_id = db.Column(db.Integer, nullable=True)  # Opcional
    resource_type = db.Column(db.String(50), nullable=True)  # 'list', 'card', 'checklist'


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    

class ChecklistItem(db.Model):
    __tablename__ = 'checklist_items'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100), nullable=False)
    done = db.Column(db.Boolean, default=False)
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'), nullable=False)
    assigned_user = db.Column(db.String(50), nullable=True)

    card = db.relationship('Card', backref=db.backref('checklist_items', cascade="all, delete-orphan"))
