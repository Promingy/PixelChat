from app.models import db, Message, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta
from random import random

def seed_messages():
    """
    Func to create the message seed data for our databse
    """

    # Logic for generating a random date
    def random_date_generator():
        start_date = datetime.now()
        end_date = start_date - timedelta(days=365)

        random_date = start_date + (end_date - start_date) * random()

        return random_date

    # create all of the seed messages for server1 channel1 aka general-channel
    channel_1_messages = [
        Message(
            user_id = 1,
            channel_id = 1,
            body =  "Hey folks! Demo-lition here, ready to break the ice on this digital adventure. 🚀",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 2,
            channel_id = 1,
            body =  "Greetings, Demo! Just finished a round of Hyrule Hide and Seek. Ganon never seems to grasp the concept of hiding. 🙄",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 3,
            channel_id = 1,
            body = "It's-a me, Mario! Demo, you should try stomping on Goombas for stress relief. Works wonders! 🍄",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 4,
            channel_id = 1,
            body = "Pika! Pikachu, pika pi. ⚡",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 5,
            channel_id = 1,
            body = "Spidey in the house! Demo, ever tried web-slinging through the demo world? It's a whole new perspective. 🕷️",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 6,
            channel_id = 1,
            body =  "Greetings, all! Just survived a Creeper invasion in Minecraft. Who knew those pixelated green guys were so explosive? 💥",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 7,
            channel_id = 1,
            body = "Hiya! Kirby here, fresh from inhaling a buffet of power-ups. Ready to float through this chat! 🌈",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 8,
            channel_id = 1,
            body = "Hello, everyone! Navigating the Underground with determination. Let's keep it fun and light-hearted! 💙",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 1,
            channel_id = 1,
            body = "Speaking of determination, Frisk, ever tried demo-ing your way through the Underground? It's surprisingly therapeutic.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 2,
            channel_id = 1,
            body = "Demo, I've heard you're the expert in breaking barriers. Any advice for my next dungeon exploration?",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 1,
            channel_id = 1,
            body = "Zelda, just demo-lish those puzzles with style! Mario, you can jump in for the assist.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 3,
            channel_id = 1,
            body = "Demo-lition and Jumpman unite! Let's-a-go, Zelda!",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 4,
            channel_id = 1,
            body = "Pika! Pikachu pi pika ⚡",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 5,
            channel_id = 1,
            body = "Demo, ever feel like swinging through Hyrule Castle? I bet it's got a great view.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 7,
            channel_id = 1,
            body = "And I'll float by for an aerial perspective! 🌌",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 6,
            channel_id = 1,
            body = "Demo, need any crafting tips? I've got a few tricks for making the ultimate demo tools.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 1,
            channel_id = 1,
            body = "Thanks, Steve! Let's craft the most demo-tastic tools ever!",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 8,
            channel_id = 1,
            body = "Sounds like a plan! Remember, everyone, friendship is our ultimate power-up. 🌟",
            created_at = random_date_generator()

        ),
    ]

    # create all of the seed messages for server 1 channel 2
    channel_2_messages = [
        Message(
            user_id = 2,
            channel_id = 2,
            body = "Guess what, everyone? I just found out Ganon started a cooking show in Hyrule. I'm not sure if I should be impressed or worried.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 3,
            channel_id = 2,
            body = "Oh, that-a guy. I bet his show is just Bowser trying to flame-broil me with fireballs. Not cool, Bowser!",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 4,
            channel_id = 2,
            body = "Pika pika! Pikachu, pi ⚡",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 5,
            channel_id = 2,
            body = "Ganon in an apron? Now that's a sight I'd pay to see. Does he use his trident as a spatula?",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 6,
            channel_id = 2,
            body = "Cooking shows? In Minecraft, my specialty is crafting pixelated feasts. No tridents involved, just a lot of crafting tables.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 7,
            channel_id = 2,
            body = "Inhaling Ganon's culinary creations might be an adventure on its own. Wonder if he includes Power-Up Pancakes?",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 8,
            channel_id = 2,
            body =  "Power-Up Pancakes sound interesting. Just don't invite Sans from Undertale. He'd turn the kitchen into a joke haven.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 1,
            channel_id = 2,
            body = "Speaking of jokes, did you hear about the creeper who walked into a bar? The whole place went up in smoke!",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 3,
            channel_id = 2,
            body = "Haha! Good one, Demo! Now, if only I could tell jokes as well as I jump on Goombas.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 4,
            channel_id = 2,
            body =  "Pika! Pikachu pi pika 😄",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 5,
            channel_id = 2,
            body = "Demo, do you ever use your demolition skills to create comedic chaos? Like, controlled explosions for entertainment?",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 1,
            channel_id = 2,
            body = "Absolutely, Spider-Man! Who needs fireworks when you can have a demo-show in the sky?",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 7,
            channel_id = 2,
            body = "I'd join that show! Inhale some popcorn and enjoy the explosive entertainment.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 6,
            channel_id = 2,
            body =  "As long as it doesn't involve TNT near my pixelated creations, count me in. Safety first!",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 2,
            channel_id = 2,
            body =  "Alright, who's up for a gaming night later? Ganon's cooking show can wait. Let's save Hyrule virtually, not gastronomically.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 8,
            channel_id = 2,
            body = "I'm in! Just no Sans jokes during the gaming session, please.",
            created_at = random_date_generator()

        ),

        Message(
            user_id = 3,
            channel_id = 2,
            body = "Agreed! Let's-a-go, team! Another adventure awaits!",
            created_at = random_date_generator()

        ),
    ]

    # Server 2 channel 1 messages
    channel_3_messages = [
        Message(
            user_id = 2,
            channel_id = 3,
            body = "Hey everyone! Just finished a marathon quest in Hyrule. Anyone up for a friendly chat or maybe some virtual swordplay?",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 3,
            channel_id = 3,
            body = "It's-a me, Mario! Always up for a chat. Zelda, how about we trade plumbing tips for sword skills? 😄",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 4,
            channel_id = 3,
            body = "Pika pika! Pikachu pi ⚡",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 7,
            channel_id = 3,
            body = "Hiya! Kirby just inhaled a load of virtual snacks. What's on the menu for today's gaming feast, friends? 🍔🎮",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 8,
            channel_id = 3,
            body = "Hello everyone! I just navigated through the Undertale Underground. Ready for some lighthearted gaming discussions. 💙",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 6,
            channel_id = 3,
            body = "Greetings! Survived another day in the pixelated mines of Minecraft. What's everyone building or battling today? 💎⚔️",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 2,
            channel_id = 3,
            body =  "Kirby, virtual snacks sound tempting! How about we embark on a culinary adventure in the digital realm after our quests?",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 4,
            channel_id = 3,
            body = "Pikachu pi pika 🍏🍰",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 3,
            channel_id = 3,
            body = "Zelda, your sword skills are legendary. How about a friendly duel in the gaming arena? Winner gets the title of 'Ultimate Champion'!",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 7,
            channel_id = 3,
            body =  "I'm all for culinary quests! Let's cook up a storm in the gaming kitchen, Zelda. Virtual feast, here we come! 🍲🎮",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 8,
            channel_id = 3,
            body = "Mario, a duel sounds like fun! Just remember, it's all in good spirits. No hard feelings, right?",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 6,
            channel_id = 3,
            body = "Count me in for the duel and the feast! Just gotta make sure no creepers crash the party. 😅🔥",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 2,
            channel_id = 3,
            body = "Frisk, agreed! A duel for fun, no hard feelings. Steve, we'll keep the creepers at bay with our swords and snacks.",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 4,
            channel_id = 3,
            body = "Pika pi! 🎮🍕",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 7,
            channel_id = 3,
            body =  "Gaming feast prep in progress! I'll whip up some Power-Up Pancakes. Ready for the feast, friends? 🥞🎮",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 3,
            channel_id = 3,
            body = "Zelda, Pikachu, Kirby, Frisk, Steve - let the gaming festivities begin! May our virtual adventures be legendary! 🌟🎮",
            created_at = random_date_generator()
        ),
    ]

    # Server 2 channel 2 messages
    channel_4_messages = [
        Message(
            user_id = 2,
            channel_id = 4,
            body = "Greetings, pixel pals! Just cleared the Water Temple. What's the latest in the gaming cosmos?",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 4,
            channel_id = 4,
            body = "PIKACHU! ⚡ 🎮",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 7,
            channel_id = 4,
            body = "Hiya! Kirby's ready for a gaming feast. Any recommendations for tasty power-ups, everyone? 🍔🍟",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 8,
            channel_id = 4,
            body = "Hello! Explored the Underground again. Anyone up for a peaceful adventure or a round of gaming jokes? 💙😄",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 6,
            channel_id = 4,
            body = "Hey all! Just crafted a mega castle in Minecraft. Ready to explore new realms or share some building tips. 🏰🕹️",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 2,
            channel_id = 4,
            body = "Kirby, how about a quest in Dream Land? Pikachu, any shocking challenges in the Pokémon world? Let's embark on a multidimensional adventure!",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 4,
            channel_id = 4,
            body = "Pika pika! ⚡🌌",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 7,
            channel_id = 4,
            body = "Dream Land delights await! Pikachu, your electric sparks will light up the path. Adventure time, pixel pals! 🌈🌟",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 8,
            channel_id = 4,
            body = "Count me in for the adventure! Ready to make choices and face challenges together. Let the quest begin! 💪🗝️",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 6,
            channel_id = 4,
            body = "Adventure calls! If anyone needs resources or a pixelated guide in Minecraft, just shout. Let's conquer these virtual worlds! 🌐⚔️",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 2,
            channel_id = 4,
            body = "To new adventures and challenges! Pixel pals, may our gaming journey be filled with joy, surprises, and epic victories! 🚀🎮",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 4,
            channel_id = 4,
            body = "Pika pika! 🎉🏆",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 7,
            channel_id = 4,
            body =  "Let the pixel party continue! Dream Land awaits our gaming escapades. Ready, set, go! 🚀🍭",
            created_at = random_date_generator()
        ),

        Message(
            user_id = 8,
            channel_id = 4,
            body = "Onward to joy and victories! Together, we'll navigate the gaming cosmos. Pixel pals, let's make every quest memorable! 🌟🎮",
            created_at = random_date_generator()
        ),
    ]

    # Pre-stage all of the messages for commit to the database
    [db.session.add(message) for message in channel_1_messages]
    [db.session.add(message) for message in channel_2_messages]
    [db.session.add(message) for message in channel_3_messages]
    [db.session.add(message) for message in channel_4_messages]

    # commit changes to the database
    db.session.commit()


def undo_messages():
    """
    func to undo remove messages from the database
    """
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text('DELETE FROM messages'))

    # commit changes to the databse
    db.session.commit()
