from app.models import db, DirectMessage, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta
from random import random

# Logic for generating a random date
def random_date_generator():
    start_date = datetime.now()
    end_date = start_date - timedelta(days=365)

    random_date = start_date + (end_date - start_date) * random()

    return random_date

room_1_messages = [
    DirectMessage(
        user_id = 3,
        direct_room_id = 1,
        body =  "Hey there, Pikachu! How's it going?",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 1,
        body =  "Pika pika!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 1,
        body =  "Glad to hear it! Are you up for a little adventure today?",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 1,
        body =  "Pika!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 1,
        body =  "Fantastic! I was thinking we could explore the Mushroom Kingdom together. There are so many new places to discover.",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 1,
        body =  "Pika pika!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 1,
        body =  "Watch out, Pikachu! Goombas ahead!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 1,
        body =  "Pika!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 1,
        body =  "Wow, that was amazing, Pikachu! Your electric powers really come in handy.",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 1,
        body =  "Pika pika!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 1,
        body =  "It looks like trouble's brewing, Pikachu. We've got to stop Bowser's minions from causing chaos.",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 1,
        body =  "Pika!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 1,
        body =  "We make a great team, Pikachu! Thanks for helping me save the day once again.",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 1,
        body =  "Pikachu!",
        created_at = random_date_generator()
    ),
]

room_2_messages = [
    DirectMessage(
        user_id = 3,
        direct_room_id = 2,
        body =  "Hey, Link! How's it going?",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 2,
        direct_room_id = 2,
        body =  "Uh, Mario, I think you've got the wrong hero. I'm Princess Zelda, not Link.",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 2,
        body =  "Oh, my bad! You know, with all those adventures you two have together, sometimes it's hard to keep track. How's everything in Hyrule?",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 2,
        direct_room_id = 2,
        body =  "It's been quite peaceful lately, thankfully. Ganon hasn't caused any trouble in a while. How about in the Mushroom Kingdom?",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 2,
        body =  "Well, you know how it is. Bowser's always up to something. But we manage to keep him in check. Luigi and I make a pretty good team.",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 2,
        direct_room_id = 2,
        body =  "Teamwork is crucial when facing evil. Speaking of which, have you heard any rumors about new challenges on the horizon?",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 2,
        body =  "Not really, but you never know when trouble might pop up. That's the thing about being a hero, right? Always ready for whatever comes our way!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 2,
        direct_room_id = 2,
        body =  "Absolutely, Mario. We must remain vigilant. Anyway, I should get going. There are some diplomatic matters I need to attend to. It was nice catching up with you!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 2,
        body =  "Same here, Zelda! Take care, and if you ever need a plumber's help, just send word!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 2,
        direct_room_id = 2,
        body =  "I'll keep that in mind. Farewell, Mario!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 3,
        direct_room_id = 2,
        body =  "Bye, Zelda! Until next time!",
        created_at = random_date_generator()
    ),
]

room_3_messages = [
    DirectMessage(
        user_id = 5,
        direct_room_id = 3,
        body =  "Hey there, Pikachu! How's the voltage flowing today?",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 3,
        body =  "Pika pika!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 5,
        direct_room_id = 3,
        body =  "Oh, you know, the usual web-slinging and crime-fighting gig. Never a dull moment in New York City.",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 3,
        body =  "Pikachu!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 5,
        direct_room_id = 3,
        body =  "Oh, you bet! Dealing with Electro is always a jolt, but I manage to short-circuit his plans every time.",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 3,
        body =  "Pika pika!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 5,
        direct_room_id = 3,
        body =  "Thanks, Pikachu! And how about you? Still shocking Team Rocket with your Thunderbolt attacks?",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 3,
        body =  "Pikachu!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 5,
        direct_room_id = 3,
        body =  "Haha, classic! Well, keep up the good work, Pikachu. If you ever need backup against those troublemakers, just give me a shout!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 3,
        body =  "Pika!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 5,
        direct_room_id = 3,
        body =  "You too, Pikachu! Take care, buddy!",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 3,
        body =  "Pikachu!",
        created_at = random_date_generator()
    ),
]

room_4_messages = [
    DirectMessage(
        user_id = 6,
        direct_room_id = 4,
        body =  "Poyo! (Pikachu, it's great to see you!)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 4,
        body =  "Pikachu! (Hi, Kirby! How's the puffball doing today?)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 6,
        direct_room_id = 4,
        body =  "Poyo! (Oh, you know, just floating around Dream Land, looking for delicious snacks. What about you? How's life in the Pokémon world?)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 4,
        body =  "Pikachu! (It's been electrifying as usual! Exploring with Ash and battling other Pokémon keeps me busy.)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 6,
        direct_room_id = 4,
        body =  "Poyo! (That sounds like quite the adventure! Do you ever get tired of battling?)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 4,
        body =  "Pikachu! (Sometimes it's exhausting, but knowing I'm helping my friends and growing stronger keeps me motivated!)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 6,
        direct_room_id = 4,
        body =  "Poyo! (I can relate to that. Helping friends is what it's all about! Hey, speaking of which, want to team up for some friendly sparring sometime?)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 4,
        body =  "Pikachu! (That sounds like a blast! Let's do it! I'll show you some of my best moves!)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 6,
        direct_room_id = 4,
        body =  "Poyo! (Sounds like a plan! I can copy your abilities with my inhale, so I'll be ready for anything!)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 4,
        body =  "Pikachu! (Let's make it a match to remember, Kirby!)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 6,
        direct_room_id = 4,
        body =  "Poyo! (You're on, Pikachu! Get ready for some puffball power!)",
        created_at = random_date_generator()
    ),
    DirectMessage(
        user_id = 4,
        direct_room_id = 4,
        body =  "Pikachu! (Bring it on, Kirby! It's going to be electrifying!)",
        created_at = random_date_generator()
    ),
]

def seed_direct_messages():

    [db.session.add(message) for message in room_1_messages]
    [db.session.add(message) for message in room_2_messages]
    [db.session.add(message) for message in room_3_messages]
    [db.session.add(message) for message in room_4_messages]

    # commit changes to the database
    db.session.commit()


def undo_direct_messages():
    """
    func to undo remove messages from the database
    """
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.direct_messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text('DELETE FROM direct_messages'))

    # commit changes to the databse
    db.session.commit()
