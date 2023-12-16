from app.models import db, Channel, environment, SCHEMA
from sqlalchemy.sql import text

def seed_channels():
    pass

def undo_channels():
    if environment == 'production':
        db.session.execture(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE")
    else:
        db.session.execute(text('DELETE FROM channels'))
    db.session.commit()
