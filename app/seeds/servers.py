from app.models import db, Server, environment, SCHEMA
from sqlalchemy.sql import text


def seed_servers() :
    servers = [
        Server(
            owner_id = '1',
            name = "OmniPlay",
            image_url = '',
            description = "Step into OmniPlay, where gaming universes collide in a magnificent mess of pixels and power-ups! It's the place where Mario trades plumbing stories with Master Chief, and Pikachu challenges Lara Croft to an electric duel. Grab your controller, a snack, and prepare for a cosmic adventure filled with more twists than a Mario Kart race. Join us at OmniPlay - where the only thing we take seriously is having a seriously good time!",
        ),

        Server(
            owner_id = '2',
            name = "Unity Universe",
            image_url = '',
            description = "Welcome to Unity Universe, the intergalactic gaming fiesta where even the aliens can't resist a round of Among Us! It's the server where Sonic tries to outrun Fortnite dancers, and Geralt of Rivia debates the best potion recipes with Cooking Mama. Join our cosmic carnival where the quests are epic, the banter is legendary, and the respawn points are like mushrooms - they keep popping up when you least expect them. Get ready for a Unity Universe experience that's out of this world and into the realm of hilarity!",
        ),
    ]

    [db.session.add(server) for server in servers]
    db.session.commit()

def undo_servers():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE")
    else:
        db.session.execute(text('DELETE FROM servers'))
    db.session.commit()
