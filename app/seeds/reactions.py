from app.models import db, Reaction, environment, SCHEMA
from .messages import channel_1_messages
from sqlalchemy.sql import text

def seed_reactions():
    """
    function to create seed data for user reactions to messages
    """
    #/ needs to be done after implementation of emoji extension

    # message 1 reactions - numbers go <message number><reaction number>
    reaction11 = Reaction(
        user_id = 2,
        message_id = 1,
        emoji = '👋'
    )
    reaction12 = Reaction(
        user_id =5,
        message_id = 1,
        emoji = '👋'
    )
    reaction13 = Reaction(
        user_id = 3,
        message_id = 1,
        emoji = '😎'
    )
    reaction14 = Reaction(
        user_id = 2,
        message_id = 1,
        emoji = '👋'
    )

    # message 2 reactions
    reaction21 = Reaction(
        user_id = 1,
        message_id = 2,
        emoji = '👋'
    )
    reaction22 = Reaction(
        user_id = 3,
        message_id = 2,
        emoji = '🌝'
    )
    reaction23 = Reaction(
        user_id = 4,
        message_id = 2,
        emoji = '🐙'
    )
    reaction24 = Reaction(
        user_id = 6,
        message_id = 2,
        emoji = '🥸'
    )
    reaction25 = Reaction(
        user_id = 8,
        message_id = 2,
        emoji = '😎'
    )

    # message 3
    reaction31 = Reaction(
        user_id = 1,
        message_id = 3,
        emoji = '🤨'
    )
    reaction32 = Reaction(
        user_id = 2,
        message_id = 3,
        emoji = '👋'
    )
    reaction33 = Reaction(
        user_id = 4,
        message_id = 3,
        emoji = '👋'
    )
    reaction34 = Reaction(
        user_id = 5,
        message_id = 3,
        emoji = '🤣'
    )
    reaction35 = Reaction(
        user_id = 6,
        message_id = 3,
        emoji = '🤓'
    )
    reaction36 = Reaction(
        user_id = 7,
        message_id = 3,
        emoji = '🥶'
    )
    reaction37 = Reaction(
        user_id = 8,
        message_id = 3,
        emoji = '🫡'
    )

    #message 4 reactions
    reaction41 = Reaction(
        user_id = 2,
        message_id = 4,
        emoji = '👋'
    )
    reaction42 = Reaction(
        user_id = 7,
        message_id = 4,
        emoji = '👋'
    )

    msg1_reactions = [reaction11, reaction12, reaction13, reaction14]
    msg2_reactions = [reaction21, reaction22, reaction23, reaction24, reaction25]
    msg3_reactions = [reaction31, reaction32, reaction33, reaction34, reaction35, reaction36, reaction37]
    msg4_reactions = [reaction41, reaction42]

    # Stage reactions for commit
    [db.session.add(reaction) for reaction in msg1_reactions]
    [db.session.add(reaction) for reaction in msg2_reactions]
    [db.session.add(reaction) for reaction in msg3_reactions]
    [db.session.add(reaction) for reaction in msg4_reactions]

    #append reactions to appropriate message
    [channel_1_messages[0].reactions.append(reaction) for reaction in msg1_reactions]
    [channel_1_messages[1].reactions.append(reaction) for reaction in msg2_reactions]
    [channel_1_messages[2].reactions.append(reaction) for reaction in msg3_reactions]
    [channel_1_messages[3].reactions.append(reaction) for reaction in msg4_reactions]

    # commit the changes
    db.session.commit()




def undo_reactions():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text('DELETE FROM reactions'))
    db.session.commit()
