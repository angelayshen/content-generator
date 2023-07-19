from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

from config import db, bcrypt

class Story(db.Model, SerializerMixin):
    __tablename__ = 'stories'

    serialize_rules = ('-user_id.stories',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    content = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    @validates('title')
    def validate_title(self, key, title):
        if not title or len(title) < 10:
            raise ValueError("Title must be at least 10 characters")
        return title

    def __repr__(self):
        return f'<Story {self.id} by {self.author} >'

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-stories', '-_password_hash')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String)

    stories = db.relationship('Story', backref='user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Cannot access password hash!')
    
    @password_hash.setter
    def password_hash(self, new_pass):
        p_hash = bcrypt.generate_password_hash(new_pass.encode('utf-8'))
        self._password_hash = p_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f"<User {self.username}>"
    
