from app.models import db, Message, environment, SCHEMA
from sqlalchemy.sql import text


def seed_messages():
    channel_1_messages = [
        Message(
            user_id = 1,
            channel_id = 1,
            body =  "Hey folks! Demo-lition here, ready to break the ice on this digital adventure. 🚀",
        ),

        Message(
            user_id = 2,
            channel_id = 1,
            body =  "Greetings, Demo! Just finished a round of Hyrule Hide and Seek. Ganon never seems to grasp the concept of hiding. 🙄"
        ),

        Message(
            user_id = 3,
            channel_id = 1,
            body = "It's-a me, Mario! Demo, you should try stomping on Goombas for stress relief. Works wonders! 🍄"
        ),

        Message(
            user_id = 4,
            channel_id = 1,
            body = "Pika! Pikachu, pika pi. ⚡"
        ),

        Message(
            user_id = 5,
            channel_id = 1,
            body = "Spidey in the house! Demo, ever tried web-slinging through the demo world? It's a whole new perspective. 🕷️"
        ),

        Message(
            user_id = 6,
            channel_id = 1,
            body =  "Greetings, all! Just survived a Creeper invasion in Minecraft. Who knew those pixelated green guys were so explosive? 💥"
        ),

        Message(
            user_id = 7,
            channel_id = 1,
            body = "Hiya! Kirby here, fresh from inhaling a buffet of power-ups. Ready to float through this chat! 🌈"
        ),

        Message(
            user_id = 8,
            channel_id = 1,
            body = "Hello, everyone! Navigating the Underground with determination. Let's keep it fun and light-hearted! 💙"
        ),

        Message(
            user_id = 1,
            channel_id = 1,
            body = "Speaking of determination, Frisk, ever tried demo-ing your way through the Underground? It's surprisingly therapeutic."
        ),

        Message(
            user_id = 2,
            channel_id = 1,
            body = "Demo, I've heard you're the expert in breaking barriers. Any advice for my next dungeon exploration?"
        ),

        Message(
            user_id = 1,
            channel_id = 1,
            body = "Zelda, just demo-lish those puzzles with style! Mario, you can jump in for the assist."
        ),

        Message(
            user_id = 3,
            channel_id = 1,
            body = "Demo-lition and Jumpman unite! Let's-a-go, Zelda!"
        ),

        Message(
            user_id = 4,
            channel_id = 1,
            body = "Pika! Pikachu pi pika ⚡"
        ),

        Message(
            user_id = 5,
            channel_id = 1,
            body = "Demo, ever feel like swinging through Hyrule Castle? I bet it's got a great view."
        ),

        Message(
            user_id = 7,
            channel_id = 1,
            body = "And I'll float by for an aerial perspective! 🌌"
        ),

        Message(
            user_id = 6,
            channel_id = 1,
            body = "Demo, need any crafting tips? I've got a few tricks for making the ultimate demo tools."
        ),

        Message(
            user_id = 1,
            channel_id = 1,
            body = "Thanks, Steve! Let's craft the most demo-tastic tools ever!"
        ),

        Message(
            user_id = 8,
            channel_id = 1,
            body = "Sounds like a plan! Remember, everyone, friendship is our ultimate power-up. 🌟"
        ),
    ]

    channel_2_messages = [
        Message(
            user_id = 2,
            channel_id = 2,
            body = "Guess what, everyone? I just found out Ganon started a cooking show in Hyrule. I'm not sure if I should be impressed or worried."
        ),

        Message(
            user_id = 3,
            channel_id = 2,
            body = "Oh, that-a guy. I bet his show is just Bowser trying to flame-broil me with fireballs. Not cool, Bowser!"
        ),

        Message(
            user_id = 4,
            channel_id = 2,
            body = "Pika pika! Pikachu, pi ⚡"
        ),

        Message(
            user_id = 5,
            channel_id = 2,
            body = "Ganon in an apron? Now that's a sight I'd pay to see. Does he use his trident as a spatula?"
        ),

        Message(
            user_id = 6,
            channel_id = 2,
            body = "Cooking shows? In Minecraft, my specialty is crafting pixelated feasts. No tridents involved, just a lot of crafting tables."
        ),

        Message(
            user_id = 7,
            channel_id = 2,
            body = "Inhaling Ganon's culinary creations might be an adventure on its own. Wonder if he includes Power-Up Pancakes?"
        ),

        Message(
            user_id = 8,
            channel_id = 2,
            body =  "Power-Up Pancakes sound interesting. Just don't invite Sans from Undertale. He'd turn the kitchen into a joke haven."
        ),

        Message(
            user_id = 1,
            channel_id = 2,
            body = "Speaking of jokes, did you hear about the creeper who walked into a bar? The whole place went up in smoke!"
        ),

        Message(
            user_id = 3,
            channel_id = 2,
            body = "Haha! Good one, Demo! Now, if only I could tell jokes as well as I jump on Goombas."
        ),

        Message(
            user_id = 4,
            channel_id = 2,
            body =  "Pika! Pikachu pi pika 😄"
        ),

        Message(
            user_id = 5,
            channel_id = 2,
            body = "Demo, do you ever use your demolition skills to create comedic chaos? Like, controlled explosions for entertainment?"
        ),

        Message(
            user_id = 1,
            channel_id = 2,
            body = "Absolutely, Spider-Man! Who needs fireworks when you can have a demo-show in the sky?"
        ),

        Message(
            user_id = 7,
            channel_id = 2,
            body = "I'd join that show! Inhale some popcorn and enjoy the explosive entertainment."
        ),

        Message(
            user_id = 6,
            channel_id = 2,
            body =  "As long as it doesn't involve TNT near my pixelated creations, count me in. Safety first!"
        ),

        Message(
            user_id = 2,
            channel_id = 2,
            body =  "Alright, who's up for a gaming night later? Ganon's cooking show can wait. Let's save Hyrule virtually, not gastronomically."
        ),

        Message(
            user_id = 8,
            channel_id = 2,
            body = "I'm in! Just no Sans jokes during the gaming session, please."
        ),

        Message(
            user_id = 3,
            channel_id = 2,
            body = "Agreed! Let's-a-go, team! Another adventure awaits!"
        ),
    ]

    [db.session.add(message) for message in channel_1_messages]
    [db.session.add(message) for message in channel_2_messages]
    db.session.commit()


def undo_messages():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text('DELETE FROM messages'))
    db.session.commit()
