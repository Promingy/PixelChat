from app.models import db, Message, environment, SCHEMA
from sqlalchemy.sql import text

def seed_messages():
    msg1 = Message(
        channel_id= 1,
        user_id = 1,
        body='Mario, i heard you\'re a plumber. Can you fix my leaky castle pipes?',
        pinned=True,
    )
    msg2 = Message(
        channel_id= 1,
        user_id = 2,
        body='Sure thing, Zelda! But first, do you h ave any giant mushrooms? They make plbuming more fun.',
        pinned=True
    )
    msg3 = Message(
        channel_id= 1,
        user_id = 1,
        body='No giant mushrooms, but I do have a master Sword. Will that work?',
        pinned=True
    )
    msg4 = Message(
        channel_id= 2,
        user_id = 1,
        body='Master Sword? That\'s-a sharp solution! I usually just use a plumger.',
        pinned=True
    )
    msg5 = Message(
        channel_id= 1,
        user_id = 1,
        body='Plunger? Is that some mystical Hyrulian artifact?',
        pinned=True
    )
    msg6 = Message(
        channel_id= 1,
        user_id = 2,
        body='Nah, it\s for unclogging toilets. Simple and effective, like jumping on Goombas.',
        pinned=True
    )
    msg7 = Message(
        channel_id= 1,
        user_id = 1,
        body='Impressive! I\'ll trade you a boomerang for one of those plungers.',
        pinned=True
    )
    msg6 = Message(
        channel_id= 1,
        user_id = 2,
        body='Deal, Zelda! Nxt time Bowser kidnaps Peach, I\'ll send him your way for a boomerang surprise.',
        pinned=True
    )
    msg7 = Message(
        channel_id= 1,
        user_id = 1,
        body='Perfect! And if Gannon gives you trouble, I\'ll send him a Piranha Plant greeting.',
    )
    msg8 = Message(
        channel_id= 1,
        user_id = 2,
        body='It\'s-a deal, Princess! Teamwork across kingdoms, who would\'ve though?',
        pinned=False
    )

    db.session.add(msg1)
    db.session.add(msg2)
    db.session.add(msg3)
    db.session.add(msg4)
    db.session.add(msg5)
    db.session.add(msg6)
    db.session.add(msg7)
    db.session.add(msg8)
    db.session.commit()


def undo_messages():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text('DELETE FROM messages'))
    db.session.commit()
