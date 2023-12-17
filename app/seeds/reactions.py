from app.models import db, Reaction, environment, SCHEMA
from sqlalchemy.sql import text

def seed_reactions():
    """
    function to create seed data for user reactions to messages
    """
    #/ needs to be done after implementation of emoji extension
    pass

def undo_reactions():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text('DELETE FROM reactions'))
    db.session.commit()