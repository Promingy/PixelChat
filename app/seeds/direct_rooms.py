from app.models import db, DirectRoom, environment, SCHEMA
from sqlalchemy.sql import text

direct_room_1 = DirectRoom(
    server_id = 1,
    owner_1_id = 3,
    owner_2_id = 4
)

direct_room_2 = DirectRoom(
    server_id = 1,
    owner_1_id = 3,
    owner_2_id = 2
)

direct_room_3 = DirectRoom(
    server_id = 1,
    owner_1_id = 4,
    owner_2_id = 5
)

direct_room_4 = DirectRoom(
    server_id = 2,
    owner_1_id = 4,
    owner_2_id = 6
)

rooms = [direct_room_1, direct_room_2, direct_room_3, direct_room_4]

def seed_direct_rooms():
    """
    Func to add seed data to the database
    - c.a.
    """
    # pre-stage all of the previously made channels for commmit
    [db.session.add(room) for room in rooms]

    # commit seed data to the database
    db.session.commit()

def undo_direct_rooms():
    """
    Func to drop all channels table from the database
    - c.a.
    """

    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.direct_rooms RESTART IDENTITY CASCADE")
    else:
        db.session.execute(text('DELETE FROM direct_rooms'))

    # commit changes for dropping tables from the database
    db.session.commit()
