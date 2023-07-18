from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

from config import db, bcrypt

class Story(db.Model, SerializerMixin):
    __tablename__ = 'stories'

    serialize_rules = ('-user_id.stories',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    content = db.Column(db.String)
    # user = db.Column(db.String)
    # preview = db.Column(db.String)
    # is_member_only = db.Column(db.Boolean, default=False)
    # date = db.Column(db.DateTime, server_default=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

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
        return f'<User {self.username} >'
    
