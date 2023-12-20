from app.models import db, Channel, environment, SCHEMA
from sqlalchemy.sql import text


# create a seed data for channels
# creating outside of the seed_channels function so that
# it can be easily imported and in the users seed file
# and the many to many table relationships can be set
channel_1 = Channel(
    server_id = 1,
    owner_id = 1,
    name = 'general',
    description = 'Go ahead and introduce yourself to the members of our community :D',
    topic = 'Introduce yourself!'
)

channel_2 = Channel(
    server_id = 1,
    owner_id = 1,
    name = 'fun-banter-lounge',
    description = 'Have some fun, light-hearted, friendly banter with other members of the server!',
    topic = 'Fun, friendly banter!'
)

channel_3 = Channel(
    server_id = 2,
    owner_id = 2,
    name = "general",
    description = 'A friendly place to introduce youself to other server members!',
    topic = 'Introduce yourself!'
)

channel_4 = Channel(
    server_id = 2,
    owner_id = 2,
    name = 'pixel-party-hangout',
    description = "Embark on multidimensional adventures, conquer challenges, and celebrate victories!",
    topic = 'Multiverse Quests'
)

channels = [channel_1, channel_2, channel_3, channel_4]


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
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE")
    else:
        db.session.execute(text('DELETE FROM channels'))

    # commit changes for dropping tables from the database
    db.session.commit()
