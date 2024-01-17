from app.models import db, Server, environment, SCHEMA
from sqlalchemy.sql import text

servers = [
    Server(
        owner_id = '1',
        name = "OmniPlay",
        description = "Step into OmniPlay, where gaming universes collide in a magnificent mess of pixels and power-ups!",
    ),
    Server(
        owner_id = '2',
        name = "Unity Universe",
        description = "Welcome to Unity Universe, the intergalactic gaming fiesta where even the aliens can't resist a round of Among Us!",
    )
]

def seed_servers():
    """
    Func that creates and adds server seed data to the database
    """

    [db.session.add(server) for server in servers]
    db.session.commit()

def undo_servers():
    """
    func that unseeds the data for Servers
    """

    if environment == 'production':
        db.session.execture(f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE")

    else:
        db.session.execture(text("DELETE FROM servers"))

    db.session.commit()
