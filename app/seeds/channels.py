from app.models import db, Channel, environment, SCHEMA
from sqlalchemy.sql import text


# create a seed data for channels
# creating outside of the seed_channels function so that
# it can be easily imported and in the users seed file
# and the many to many table relationships can be set
channel_1 = Channel(
    server_id = 1,
    owner_id = 1,
    name = 'General',
    description = '',
    topic = 'Introduce yourself!'
)

channel_2 = Channel(
    server_id = 1,
    owner_id = 1,
    name = 'Fun Banter Lounge',
    description = 'Have some fun, light-hearted, friendly banter with other members of the server!',
    topic = 'Fun, friendly banter!'
)

channels = [channel_1, channel_2]


def seed_channels():
    """
    Func to add seed data to the database
    - c.a.
    """

    # pre-stage all of the previously made channels for commmit
    [db.session.add(channel) for channel in channels]

    # commit seed data to the database
    db.session.commit()

def undo_channels():
    """
    Func to drop all channels table from the database
    - c.a.
    """

    if environment == 'production':
        db.session.execture(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE")
    else:
        db.session.execute(text('DELETE FROM channels'))

    # commit changes for dropping tables from the database
    db.session.commit()
