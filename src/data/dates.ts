/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DateOption, Achievement, Category, Mood, Distance, Climate } from '../types';

export const DATE_POOL: DateOption[] = [
  {
    id: 'ramen-random',
    title: '🍜 The Blind Slurp & Meme-Face Ramen Challenge',
    activity: 'Visit a local ramen/noodle shop or set up an instant-ramen bar at home. One partner gets the spiciest option, the other gets the mildest, and you must swap bowls blindfolded at the halfway mark while speaking only in dramatic anime villain voices.',
    foodChallenge: 'Blind taste-test 3 mystery sauces or toppings with your noodles without spitting them out.',
    miniChallenge: 'Take a high-contrast close-up selfie of your partner trying to gracefully eat long noodles without using their hands.',
    conversationCards: [
      'If you could live inside any chaotic anime universe, which one and why?',
      'What is the single most bizarre food combination you secretly love but would never order in public?',
      'If money were no object, what ridiculous, noisy hobby would you take up?',
      'If you could rename your partner after a legendary historical warrior, what would you choose?'
    ],
    playlistName: 'Global Lofi & Indie Chill (Hindi, English, Japanese, Korean) 🌙',
    playlistEmoji: '🌙',
    estimatedTime: '1.5 Hours',
    difficulty: 2,
    budgetVal: 700,
    secretTwist: 'Whoever makes any chewing noise first has to perform a dramatic 15-second anime battle scream.',
    category: 'food',
    moodTags: ['cozy', 'budget', 'lazy'],
    distanceTag: 'nearby',
    climates: ['rainy', 'cold', 'windy']
  },
  {
    id: 'retro-arcade',
    title: '👾 Retro Arcade Button-Masher Bet',
    activity: 'Find a local gaming arcade or set up classic multiplayer retro fighting games on a screen at home. Play a high-stakes best-of-5 tournament where the loser has a ridiculous forfeit.',
    foodChallenge: 'Order the most neon-colored drink or radioactive-looking snack available, and share a giant dessert using only one spoon.',
    miniChallenge: 'Take a glowing, blurry photo of your faces illuminated only by screen glare like mysterious hackers.',
    conversationCards: [
      'What is your ultimate go-to zombie apocalypse survival plan, and who gets sacrificed first?',
      'Which video game character is your spiritual animal and why?',
      'What is the cringiest early-2000s trend you were completely obsessed with?',
      'If you could delete one social media app from existence forever, what is it?'
    ],
    playlistName: 'Synthwave & J-Pop Beats (Korean, Japanese, English Synth) 👾',
    playlistEmoji: '👾',
    estimatedTime: '2 Hours',
    difficulty: 2,
    budgetVal: 1200,
    secretTwist: 'You must play one entire round with your hands swapped on each other\'s controllers.',
    category: 'game',
    moodTags: ['adventure', 'night_owl'],
    distanceTag: 'up_to_10',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'bookstore-hunt',
    title: '📚 The Silent Spy Bookstore Safari',
    activity: 'Go to a massive local bookstore or old library. You have exactly 15 minutes to sneak around like covert agents and find three items: one book that describes your partner, one about a useless hobby, and one with a ridiculous cover.',
    foodChallenge: 'Head to the nearest cafe and read each other the funniest or most dramatic sentence from your chosen books using your best British royalty accents.',
    miniChallenge: 'Take a spy-style picture holding the books in front of your faces like mysterious double agents.',
    conversationCards: [
      'If you had to write a scandalous memoir, what would the title be?',
      'What book or story completely ruined your childhood sleep schedule?',
      'Would you rather be able to speak every human language fluently, or speak to chaotic street cats?',
      'What is a secret, completely useless talent you have that deserves a trophy?'
    ],
    playlistName: 'Paris Cafe & Urdu Ghazals (French, Urdu, English Acoustic) ☕',
    playlistEmoji: '☕',
    estimatedTime: '2 Hours',
    difficulty: 1,
    budgetVal: 400,
    secretTwist: 'Find the weirdest, cheapest item (under ₹100) in the store and buy it for your partner.',
    category: 'cafe',
    moodTags: ['cozy', 'budget', 'lazy'],
    distanceTag: 'nearby',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'diy-pottery',
    title: '🎨 Bizarre Face-Painting & Clay Chaos',
    activity: 'Buy cheap air-dry sculpting clay or face paint. Sit across from each other and paint a famous meme (like Pepe, Doge, or crying cat) on each other\'s cheeks, or sculpt each other\'s face in clay completely from memory without looking down.',
    foodChallenge: 'Eat a meal entirely with your non-dominant hands while your creations dry/meme faces are on.',
    miniChallenge: 'Walk to a nearby shop with your painted face memes intact and snap a high-fashion photo ordering a coffee.',
    conversationCards: [
      'What is the single best piece of advice you’ve ever received, even if you did the exact opposite?',
      'What is something you’re ridiculously passionate about that would make other people fall asleep?',
      'What is your partner\'s ultimate annoying quirk that you secretly find adorable?',
      'If you had to enter a witness protection program, what would your new name and fake job be?'
    ],
    playlistName: 'Global Chill Acoustic (Spanish, Hindi, English Indie) 🌿',
    playlistEmoji: '🌿',
    estimatedTime: '2 Hours',
    difficulty: 3,
    budgetVal: 500,
    secretTwist: 'If anyone stares at your painted faces, you must both wink at them simultaneously with straight faces.',
    category: 'creative',
    moodTags: ['cozy', 'budget', 'lazy'],
    distanceTag: 'stay_home',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'sunrise-drive',
    title: '🚗 Gas Station Gourmet & Lost Highway Escape',
    activity: 'Hop in a car or summon an auto/cab. Drive to the highest accessible hill, bridge, or scenic point. Roll the windows down, ask the driver/partner to take 3 random turns, and stop at a random late-night gas station or convenience store.',
    foodChallenge: 'Buy 3 random snack bags with a ₹300 budget. You must combine them to create a "3-star Michelin plate" presentation on a napkin and feed each other.',
    miniChallenge: 'Take an artistic, blurry picture of neon streetlights through the window.',
    conversationCards: [
      'What is the most adventurous thing you’ve ever done on a whim, and would you do it again?',
      'Do you believe in ghosts, aliens, or the simulation? Which one is most likely real?',
      'What’s a dream you had recently that felt so real you woke up confused?',
      'If you could wake up tomorrow with any new skill or cheat-code, what would it be?'
    ],
    playlistName: 'Punjabi Car Beats & Phonk (Punjabi, English, Haryanvi Rap) 🚗',
    playlistEmoji: '🚗',
    estimatedTime: '3 Hours',
    difficulty: 2,
    budgetVal: 1500,
    secretTwist: 'No Google Maps allowed! You must ask at least one local stranger for directions to "the most mystical spot in town" and go there.',
    category: 'explore',
    moodTags: ['adventure', 'night_owl', 'outdoors'],
    distanceTag: 'anywhere',
    climates: ['sunny', 'cold', 'windy']
  },
  {
    id: 'escape-room-rush',
    title: '🧩 Brain Cell Battle (Escape Room Mystery)',
    activity: 'Book a local escape room or set up a series of crazy lockbox riddles at home using household items.',
    foodChallenge: 'Enjoy a post-solve meal where the rules say you are strictly forbidden from using nouns when talking about the food.',
    miniChallenge: 'Take a dramatic movie-poster-style photo holding up a whiteboard of your escape time (or glorious failure).',
    conversationCards: [
      'How do you handle high-pressure situations in normal life, and does it involve crying?',
      'What fictional historical mystery would you love to solve in real life?',
      'Who is the more logical thinker, and who is the more creative thinker among us?',
      'What is your absolute favorite puzzle or brainteaser?'
    ],
    playlistName: 'Coke Studio Mashups (Urdu, Punjabi, Sindhi, Balochi Folk) 🎤',
    playlistEmoji: '🔥',
    estimatedTime: '2.5 Hours',
    difficulty: 3,
    budgetVal: 3000,
    secretTwist: 'For the first 10 minutes of the challenge, you can only communicate using whispers or frantic gestures.',
    category: 'challenge',
    moodTags: ['adventure'],
    distanceTag: 'up_to_10',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'street-food-marathon',
    title: '🍢 Street Food Coin-Flip Roulette',
    activity: 'Head to a bustling local street-food lane. Flip a coin at every third food stall: heads means you buy a popular snack, tails means you ask the vendor to pick their favorite item, no matter how chaotic.',
    foodChallenge: 'Eat everything sharing a single plate or toothpick. Try at least one extremely spicy dish.',
    miniChallenge: 'Capture a slow-motion video of your partner\'s raw reaction to eating something extremely spicy or sour.',
    conversationCards: [
      'What is your ultimate comfort street food that makes you feel instant joy?',
      'If you could eat only one country\'s cuisine for the rest of your life, what would it be?',
      'What’s the weirdest thing you’ve ever bought online late at night while sleep-deprived?',
      'Who is the absolute pickiest eater you know?'
    ],
    playlistName: 'Spanish Reggaeton & Desi Hip-Hop (Spanish, Hindi, Punjabi) 💃',
    playlistEmoji: '🍢',
    estimatedTime: '1.5 Hours',
    difficulty: 1,
    budgetVal: 600,
    distanceTag: 'nearby',
    moodTags: ['budget', 'outdoors', 'adventure'],
    secretTwist: 'You can only drink water or cold drinks after you have tried at least 3 completely different stalls.',
    category: 'food',
    climates: ['sunny', 'windy', 'cold']
  },
  {
    id: 'rainy-pillow-fort',
    title: '🌧 Pillow Fort Cinema & Terrible Dubbing',
    activity: 'Gather all sheets, pillows, and fairy lights. Build a massive, cozy floor fortress and set up a laptop or projector inside. Play a movie completely in a foreign language with subtitles turned off.',
    foodChallenge: 'Eat movie theater-style butter popcorn using only chopsticks or with no hands like a baby bird.',
    miniChallenge: 'Take a cozy inside-the-fort selfie showing off your light canopy.',
    conversationCards: [
      'If you could slow down time, what would you do with your extra hours?',
      'What is your favorite sound when it rains?',
      'What childhood toy or cartoon makes you feel most nostalgic?',
      'What is a secret guilty pleasure movie that you secretly love?'
    ],
    playlistName: 'Bollywood Monsoon Nostalgia (Hindi, Bengali, Tamil Melodies) ☕',
    playlistEmoji: '🌧',
    estimatedTime: '3 Hours',
    difficulty: 1,
    budgetVal: 100,
    secretTwist: 'You must make up the movie dialogue yourselves in real time, making it as dramatic and silly as possible.',
    category: 'movie',
    moodTags: ['cozy', 'rainy', 'lazy', 'budget'],
    distanceTag: 'stay_home',
    climates: ['rainy', 'cold', 'windy']
  },
  {
    id: 'board-game-cafe',
    title: '🎲 Board Game Rivalry & Snail Slaps',
    activity: 'Visit a board game cafe or dust off some old card/board games at home (like Uno, Jenga, Catan, Monopolish). Play with chaotic custom speed rules.',
    foodChallenge: 'Every time a player loses a turn or point, they must feed the other player a snack piece with an airplane noise.',
    miniChallenge: 'Capture a photo of the dramatic split-second moment a Jenga tower crashes down.',
    conversationCards: [
      'Are you a competitive person, or do you prefer collaborative play?',
      'What is the funniest argument you’ve ever been in?',
      'If you were a superhero, who would be your archenemy?',
      'What is something you are surprisingly terrible at?'
    ],
    playlistName: 'Japanese Future Funk & Indie Rock (Japanese, Korean, English) 🎸',
    playlistEmoji: '🎲',
    estimatedTime: '2 Hours',
    difficulty: 2,
    budgetVal: 800,
    secretTwist: 'The winner gets to invent a ridiculous rule that the loser must follow for the next 24 hours (like jumping on one leg).',
    category: 'game',
    moodTags: ['cozy', 'lazy', 'rainy'],
    distanceTag: 'nearby',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'thrift-store-outfits',
    title: '🛍 Thrift Store Cursed Outfit Swap',
    activity: 'Go to a cheap thrift store or local clothing market. You have exactly 20 minutes to assemble the absolute ugliest, loudest, most "cursed Gen Z fashion outfit" for your partner within a ₹500 budget.',
    foodChallenge: 'Go grab bubble tea or milkshakes while wearing your newly acquired cursed outfits without laughing.',
    miniChallenge: 'Do a 10-second dramatic outdoor runway model walk on the sidewalk and record it.',
    conversationCards: [
      'What is your ultimate fashion red flag in other people?',
      'If you could bring back any dead historical fashion trend, what is it?',
      'What is the oldest piece of clothing you own that you still wear?',
      'How would you describe your partner’s style in 3 words?'
    ],
    playlistName: 'Latin Pop & K-HipHop Jams (Spanish, Korean, English Rap) 💃',
    playlistEmoji: '💃',
    estimatedTime: '2.5 Hours',
    difficulty: 2,
    budgetVal: 1500,
    secretTwist: 'You must wear the outfits during your entire walk/cafe visit. No exceptions!',
    category: 'challenge',
    moodTags: ['adventure', 'budget'],
    distanceTag: 'up_to_10',
    climates: ['sunny', 'windy', 'cold']
  },
  {
    id: 'outdoors-sunset-picnic',
    title: '🌿 Golden Hour Paint & Picnic Chaos',
    activity: 'Pack a cozy rug, watercolor paints, and a basket of snacks. Head to a local park or lake during the hour before sunset.',
    foodChallenge: 'Try to recreate a "Pinterest-style" snack board using only items purchased under ₹400.',
    miniChallenge: 'Paint a portrait of your partner using only your fingers, and capture a photo holding them up together.',
    conversationCards: [
      'When do you feel most connected to nature?',
      'If you could build a cabin anywhere in the world, where would it be?',
      'What is your favorite memory of a vacation or road trip?',
      'What is your absolute favorite time of the day?'
    ],
    playlistName: 'Acoustic Folk Sunsets (Swedish, English, Hindi Acoustic) 🌿',
    playlistEmoji: '☀',
    estimatedTime: '2 Hours',
    difficulty: 2,
    budgetVal: 500,
    secretTwist: 'You can only use water from the park pond or local water bottles to clean your paintbrushes.',
    category: 'creative',
    moodTags: ['outdoors', 'budget', 'lazy'],
    distanceTag: 'up_to_10',
    climates: ['sunny', 'windy']
  },
  {
    id: 'monsoon-monsoon',
    title: '🌧 Monsoon Puddle Parkour & Cutting Chai',
    activity: 'It is pouring outside! Grab two umbrellas (or don\'t) and run to a trail or city park. You must jump over every single puddle like an athlete while filming slow-motion videos.',
    foodChallenge: 'Find a local tea stall. Drink steaming hot roadside cutting chai and eat spicy bread-pakoras directly under the rain.',
    miniChallenge: 'Take a slow-motion video of your partner splashing into a massive puddle in dramatic Bollywood slow-motion.',
    conversationCards: [
      'What is your absolute favorite rainy day comfort song?',
      'Do you prefer cozy cold winter rain, or heavy refreshing summer downpours?',
      'What is the funniest storm or weather fail you have ever survived?',
      'If you could fly above the clouds, what would you do?'
    ],
    playlistName: 'Coke Studio & Rainy Classics (Urdu, Hindi, Punjabi) 🌧',
    playlistEmoji: '🌧',
    estimatedTime: '1.5 Hours',
    difficulty: 3,
    budgetVal: 200,
    secretTwist: 'Whoever gets their shoes or socks wet first must perform a dramatic 15-second love song in the rain.',
    category: 'explore',
    moodTags: ['rainy', 'outdoors', 'adventure'],
    distanceTag: 'nearby',
    climates: ['rainy']
  },
  {
    id: 'ikea-hide-and-seek',
    title: '🛋️ Swedish Showroom Stealth & Meatball Mugging',
    activity: 'Go to a giant furniture showroom or department store. Play "Undercover Camouflage" where you take turns hiding in wardrobes, testing couches, or pretending to be human mannequins while the other partner tracks you down using spy binoculars (or your hands like binoculars).',
    foodChallenge: 'Eat a platter of meatballs or dessert at the food court while maintaining aggressive direct eye contact with each other without speaking.',
    miniChallenge: 'Snap a picture of your partner peeking out from inside a closet or pretending to sleep in a display bedroom.',
    conversationCards: [
      'If you could secretly move into any store or museum overnight, which one would it be?',
      'What is the most ridiculous piece of furniture you would buy if you were a billionaire?',
      'Do you prefer minimalistic space-age design or cozy antique visual clutter?',
      'What is your partner’s ultimate sleeping habit that makes you laugh?'
    ],
    playlistName: 'Nordic Indie & K-Indie Vibes (Swedish, Korean, English Indie) 🎹',
    playlistEmoji: '🇸🇪',
    estimatedTime: '2.5 Hours',
    difficulty: 2,
    budgetVal: 400,
    secretTwist: 'You must whisper the word "BÖRK" randomly in a Swedish accent during every conversation segment.',
    category: 'challenge',
    moodTags: ['adventure', 'lazy', 'cozy'],
    distanceTag: 'up_to_10',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'grocery-blind-sweep',
    title: '🛒 The Blindfold Grocery Sweepstakes',
    activity: 'Visit a supermarket. One partner wears a sleeping mask or closes their eyes tight while steering the shopping cart, guided only by the vocal directions of the other partner speaking in a pilot intercom voice.',
    foodChallenge: 'Blindfold grab 1 random mystery item from the snack aisle. You MUST incorporate that snack into your dinner tonight.',
    miniChallenge: 'Take a dramatic high-contrast portrait of your partner posing heroically with a carton of eggs in the middle of an aisle.',
    conversationCards: [
      'If you were an ingredient, what would you be and what dish would you belong in?',
      'What is the single most expensive food you have ever tasted and was it actually worth it?',
      'If we could open a quirky fusion restaurant together, what would we serve?',
      'What snack can you eat an infinite amount of without getting sick?'
    ],
    playlistName: 'Upbeat Tokyo J-Pop & French House (Japanese, French, English Pop) 🛒',
    playlistEmoji: '🛒',
    estimatedTime: '1 Hour',
    difficulty: 2,
    budgetVal: 600,
    secretTwist: 'You can only buy items that have the letter "X" or "Z" in their brand name.',
    category: 'game',
    moodTags: ['budget', 'lazy'],
    distanceTag: 'nearby',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'haunted-ghost-hunt',
    title: '👻 Spooky Midnight Alley & Ghost Recorder Challenge',
    activity: 'Find an old historically spooky site, graveyard gate, or a quiet dark road in your neighborhood. Turn off all phone lights and sit in silence for 3 minutes trying to record "supernatural feedback" on a phone voice memo app.',
    foodChallenge: 'Drink spicy, steaming ginger hot tea from a late-night roadside tea stall while telling each other the most terrifying real paranormal story you know.',
    miniChallenge: 'Take a night-mode flash photo of your partner looking completely horrified, as if a ghost is standing right behind them.',
    conversationCards: [
      'Do you believe in past lives? Who do you think you were in a previous century?',
      'If you could communicate with one deceased historical figure, who would it be?',
      'What is the creepiest "glitch in the matrix" you have ever experienced first-hand?',
      'If this world was a simulation, who is running it and why?'
    ],
    playlistName: 'Spooky Synth & Dark Phonk (Russian, Punjabi, English Beats) 💀',
    playlistEmoji: '💀',
    estimatedTime: '2 Hours',
    difficulty: 3,
    budgetVal: 200,
    secretTwist: 'If a stray dog barks, you must both run 50 meters in the opposite direction like Scooby-Doo.',
    category: 'explore',
    moodTags: ['adventure', 'night_owl'],
    distanceTag: 'nearby',
    climates: ['windy', 'cold', 'rainy']
  },
  {
    id: 'formal-gala-stall',
    title: '🤵 Celebrity Gala Wear & Roadside Tapri Chai',
    activity: 'Put on your absolute finest clothing—suits, black ties, gala dresses, sparkling heels, or glamorous traditional wedding outfits. Then, walk to a cheap local roadside tea stall or street-side bun-maska vendor.',
    foodChallenge: 'Order a single ₹20 cutting chai and split a biscuit, acting as if you are tasting a million-dollar caviar dish at an elite charity gala.',
    miniChallenge: 'Take a high-fashion, high-contrast modeling shot of your partner leaning elegantly against a rusty trash bin or dusty wall while holding the cutting chai.',
    conversationCards: [
      'If you were invited to the Met Gala, what absurd, non-functional outfit would you wear?',
      'What is your ultimate dream event to attend dressed as a king or queen?',
      'Which celebrity do you think has the absolute best aesthetic taste?',
      'If you became famous overnight, what is the very first thing you would buy?'
    ],
    playlistName: 'Opera Beats & Punjabi Club Mashup (Italian, Spanish, Punjabi HipHop) 🎻',
    playlistEmoji: '🎻',
    estimatedTime: '2 Hours',
    difficulty: 2,
    budgetVal: 300,
    secretTwist: 'If anyone asks why you are so dressed up, you must tell them with a straight face: "Our yacht sank, and this was the only clothing we saved."',
    category: 'creative',
    moodTags: ['adventure', 'budget', 'night_owl'],
    distanceTag: 'nearby',
    climates: ['sunny', 'windy', 'cold']
  },
  {
    id: 'silent-disco-super',
    title: '🎧 Silent Headphone Dance in a Supermarket',
    activity: 'Go to a large retail store or supermarket. Connect your AirPods/headphones to the exact same Spotify playlist. Press play at the exact same second, and walk through the aisles dancing silently in synchronization.',
    foodChallenge: 'Pick a high-carb junk food snack from the aisle and eat it while matching your chewing rate to the BPM of the current song.',
    miniChallenge: 'Take a blurry action shot of your partner mid-spin or doing a dance move in front of the dairy section.',
    conversationCards: [
      'What is your absolute ultimate "guilty pleasure" dance song that you only blast when home alone?',
      'If you could instantly master any style of dance (like tango, salsa, or breakdancing), what would it be?',
      'What is your partner\'s most characteristic dancing physical expression?',
      'Which song lyrics do you consistently sing wrong but refuse to correct?'
    ],
    playlistName: 'Global High-BPM Disco (Spanish, Korean, Hindi, English House) ⚡',
    playlistEmoji: '🕺',
    estimatedTime: '1.5 Hours',
    difficulty: 2,
    budgetVal: 200,
    secretTwist: 'You must do a subtle high-five every time a new song begins playing.',
    category: 'game',
    moodTags: ['lazy', 'budget'],
    distanceTag: 'nearby',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'toe-paint-pictionary',
    title: '🎨 Toe-Paint Pictionary & Handless Eating',
    activity: 'Buy cheap drawing paper and kids paints. Draw secret chaotic nouns from a hat, but you are strictly forbidden from using your hands to paint—you must hold the paintbrush or marker with your toes or mouth to draw for your partner.',
    foodChallenge: 'Eat a bowl of noodles, chips, or cupcakes using absolutely no hands (hands must be tied behind your backs) like messy, happy puppies.',
    miniChallenge: 'Take a funny overhead photo of the chaotic toe-drawn masterpiece alongside your paint-stained feet.',
    conversationCards: [
      'What is the single most embarrassing art piece you created as a child?',
      'If you had to paint a mural on our bedroom wall, what would you paint to annoy me?',
      'Who is the more patient partner when things get incredibly messy?',
      'If you could steal one famous masterpiece from the Louvre, what would it be?'
    ],
    playlistName: 'Silly Cartoon Tunes & French Pop (French, English, Hindi Acoustic) 🤪',
    playlistEmoji: '🤪',
    estimatedTime: '2 Hours',
    difficulty: 3,
    budgetVal: 300,
    secretTwist: 'You must hold your breath for 5 seconds every time your partner guesses the drawing incorrectly.',
    category: 'creative',
    moodTags: ['cozy', 'lazy', 'budget'],
    distanceTag: 'stay_home',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'water-balloon-siege',
    title: '🎈 Extreme Water Balloon Castle Siege',
    activity: 'Build a fortress out of cardboard boxes, old chairs, or bed sheets in a backyard, terrace, or living room. Fill 15 water balloons (or rolled-up soft wet socks if indoors) and engage in a rapid-fire tactical siege battle.',
    foodChallenge: 'Reward yourself with popsicles or ice cream where the loser of the siege has to hold the ice cream for the winner while they eat.',
    miniChallenge: 'Take a slow-motion action-shot of a splash landing directly on your partner\'s arm or back.',
    conversationCards: [
      'What was your absolute favorite outdoor game to play as a child during summers?',
      'If you had to join a professional medieval siege team, what would your role be?',
      'Do you prefer super hot tropical weather or freezing mountain climates?',
      'Who would survive longer in a wild forest survival camp?'
    ],
    playlistName: 'Energetic Phonk & Latin Hits (Spanish, Portuguese, Punjabi Phonk) 💥',
    playlistEmoji: '🎈',
    estimatedTime: '1.5 Hours',
    difficulty: 3,
    budgetVal: 300,
    secretTwist: 'You are only allowed to move by hopping on one leg during the entire water battle.',
    category: 'challenge',
    moodTags: ['adventure', 'outdoors'],
    distanceTag: 'stay_home',
    climates: ['sunny', 'windy']
  },
  {
    id: 'spicy-wing-detector',
    title: '🌶️ Spicy Lie-Detector Paneer or Wing Challenge',
    activity: 'Buy or cook some wings or paneer bites. Coat them in progressive levels of hot sauce. Write down 5 extremely spicy, funny, or deep questions for each other. You must eat a wing/paneer bite before answering each question.',
    foodChallenge: 'Refusing to answer a question means you must eat the "Death Bite" (double-coated in the hottest sauce) while reciting a love poem.',
    miniChallenge: 'Take a snapshot of your partner\'s sweaty, teary-eyed red face after they eat the spiciest wing.',
    conversationCards: [
      'What is a secret opinion you have that you think I would completely disagree with?',
      'What is something I do that instantly makes you smile, even when you\'re angry?',
      'What is the most embarrassing thing that has happened to us as a couple?',
      'If we had to get a matching tattoo, what chaotic design would we get and where?'
    ],
    playlistName: 'Spicy Bollywood & Spanish Salsa (Spanish, Hindi, English Beats) 🌶️',
    playlistEmoji: '🌶️',
    estimatedTime: '2 Hours',
    difficulty: 3,
    budgetVal: 800,
    secretTwist: 'You are not allowed to drink milk, water, or eat sugar until all questions have been fully answered!',
    category: 'food',
    moodTags: ['cozy', 'night_owl'],
    distanceTag: 'stay_home',
    climates: ['sunny', 'rainy', 'cold', 'windy']
  },
  {
    id: 'special-candlelight',
    title: '🕯️ The Candlelit Blindfolded Gourmet Escape',
    activity: 'Transform your room or terrace into a private Michelin-starred restaurant with low dim lights or 10 candles. One partner cooks or orders a surprise 3-course meal. The other partner is blindfolded and must guess the secret ingredients of each course while classical piano or beautiful acoustics play.',
    foodChallenge: 'Feed each other dessert blindfolded without getting chocolate or cream on their noses.',
    miniChallenge: 'Take a beautiful high-contrast silhouette portrait of your partner in the candlelight.',
    conversationCards: [
      'What was the exact moment you realized you had fallen for me?',
      'If you could freeze one day of our relationship in a crystal ball forever, which day would it be?',
      'What is one dream you hope we accomplish together in the next 5 years?'
    ],
    playlistName: 'Romantic Acoustic Symphony & Urdu Ghazals 🕯️',
    playlistEmoji: '🕯️',
    estimatedTime: '3 Hours',
    difficulty: 2,
    budgetVal: 2000,
    secretTwist: 'You must write a 3-line love letter on a napkin and slide it to your partner halfway through.',
    category: 'food',
    moodTags: ['cozy', 'lazy', 'surprise'],
    distanceTag: 'stay_home',
    climates: ['sunny', 'rainy', 'cold', 'windy'],
    isSpecialOccasion: true
  },
  {
    id: 'special-stargazing',
    title: '🌟 The Celestial Midnight Stargazing & Time Capsule',
    activity: 'Head to a rooftop, quiet terrace, or open park field under the stars. Set up blankets, pillows, and a hot thermos of cocoa. Look for constellations, write a mutual "future-love letter" sealed in a jar or envelope to be opened exactly 1 year from today, and bury or hide it safely.',
    foodChallenge: 'Sip on warm hot chocolate and share marshmallow bites while counting stars or light flashes.',
    miniChallenge: 'Take a long-exposure or night-mode sky selfie framed by stars or distant city lights.',
    conversationCards: [
      'Where do you see us ten years from now?',
      'If we were assigned as stars in a galaxy, what would our constellation shape represent?',
      'What is the sweetest thing your partner has done for you this past month?'
    ],
    playlistName: 'Indie Lofi Sunset & Cosmic Sleep 🌟',
    playlistEmoji: '🌟',
    estimatedTime: '2.5 Hours',
    difficulty: 1,
    budgetVal: 500,
    secretTwist: 'Whisper three secret wishes for your partner into the wind.',
    category: 'explore',
    moodTags: ['outdoors', 'night_owl', 'cozy', 'surprise'],
    distanceTag: 'anywhere',
    climates: ['sunny', 'windy', 'cold'],
    isSpecialOccasion: true
  },
  {
    id: 'special-agent',
    title: '🎭 The Secret Agent Roleplay & Speakeasy VIP Evening',
    activity: 'Pick an elegant lounge, speakeasy, or aesthetic cafe. Create secret alter egos (e.g., "Victoria, the art curator" and "Julian, the jewel thief"). Arrive separately, meet at the bar, and pretend you are complete strangers meeting for the first time while trying to "buy each other a drink."',
    foodChallenge: 'Order a custom cocktail or mocktail and name it after your partner\'s alter ego.',
    miniChallenge: 'Snap a black-and-white cinematic picture of your partner looking mysteriously into the distance.',
    conversationCards: [
      'If you could steal any famous treasure in the world, what would it be?',
      'What is your secret agent code name and what is your ultimate weakness?',
      'What part of your partner\'s personality is the most mysterious to you?'
    ],
    playlistName: 'Noir Jazz Beats & Club Phonk 🎭',
    playlistEmoji: '🎭',
    estimatedTime: '3 Hours',
    difficulty: 3,
    budgetVal: 2500,
    secretTwist: 'Slip a secret written message containing a funny instructions or quest into your partner\'s pocket without them noticing until the end of the date.',
    category: 'challenge',
    moodTags: ['adventure', 'night_owl', 'surprise'],
    distanceTag: 'up_to_10',
    climates: ['sunny', 'rainy', 'cold', 'windy'],
    isSpecialOccasion: true
  }
];

export const CONVERSATION_STARTERS: string[] = [
  'What is your absolute weirdest quirk that you do when you are completely alone?',
  'Which fictional world would you choose to live in for exactly one week?',
  'If all currency vanished and we traded in talents, what would your primary currency be?',
  'What is something you have never told anyone else before?',
  'What superpower would actually be the most annoying or inconvenient to have?',
  'What is your absolute biggest irrational fear (like cotton balls or escalators)?',
  'What was your dream job when you were 7 years old, and how close are you to it now?',
  'If you could rename yourself to anything extremely dramatic, what would you pick?',
  'Would you rather know the absolute truth about every mystery on Earth, or have an unlimited bank balance?',
  'What is the absolute funniest text message you have ever received by mistake?',
  'If you were a ghost, who would you spend your time haunting and why?',
  'What’s the most ridiculous lie you successfully convinced someone of?',
  'If you could invite three historical or fictional characters to a dinner party, who are they?',
  'What is the single most nostalgic song that immediately takes you back to high school?',
  'What is your love language? (Quality time, physical touch, words of affirmation, gifts, acts of service)'
];

export const BONUS_QUESTS: { text: string; reward: string; emoji: string }[] = [
  {
    text: '🎉 BONUS QUEST! The next person you see wearing blue, give them a genuine compliment.',
    reward: '+50 Love Points ❤️',
    emoji: '💙'
  },
  {
    text: '🎁 SECRET MISSION! Whoever laughs first has to buy the dessert on your next date.',
    reward: '+100 Laugh Tokens 😂',
    emoji: '🍨'
  },
  {
    text: '📸 QUICK PHOTO! Take a high-fashion model pose picture right now using the nearest random object as a luxury prop.',
    reward: '+75 Aesthetic Score ✨',
    emoji: '🕶️'
  },
  {
    text: '🪙 FLIP TIME! Flip a coin. If heads, partner does a silly dance. If tails, you do a silly dance.',
    reward: '+30 Mood Boost 💃',
    emoji: '🪙'
  },
  {
    text: '🧸 PLUSHIE SEARCH! Find or take a photo of any stuffed animal, toy, or pet near you.',
    reward: '+45 Cozy Vibes 🧸',
    emoji: '🐶'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_spin',
    name: 'First Photo Complete',
    description: 'Complete your first date challenge by uploading an adventure photo.',
    emoji: '📸',
    unlocked: false
  },
  {
    id: 'rain_survivor',
    name: 'Rain Survivor',
    description: 'Completed a Monsoon/Rainy mood date with a photo proof!',
    emoji: '🌧',
    unlocked: false
  },
  {
    id: 'budget_master',
    name: 'Budget Master',
    description: 'Completed a date under ₹500 with photo proof.',
    emoji: '💸',
    unlocked: false
  },
  {
    id: 'food_explorer',
    name: 'Food Explorer',
    description: 'Completed a food/ramen swap challenge with photo proof.',
    emoji: '🍜',
    unlocked: false
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Completed a late-night gas station gourmet or late escape with photo proof.',
    emoji: '🌙',
    unlocked: false
  },
  {
    id: 'adventure_couple',
    name: 'Adventure Couple',
    description: 'Completed a high budget escape room or anywhere travel date with photo proof.',
    emoji: '🤩',
    unlocked: false
  },
  {
    id: 'scrapbooker',
    name: 'Memory Scrapbooker',
    description: 'Logged your very first memory card in the digital scrapbook with photo proof.',
    emoji: '📖',
    unlocked: false
  }
];

export const PLAYLIST_LINKS: Record<string, string> = {
  'Global Lofi & Indie Chill (Hindi, English, Japanese, Korean) 🌙': 'https://open.spotify.com/search/hindi%20english%20japanese%20korean%20lofi%20chill',
  'Synthwave & J-Pop Beats (Korean, Japanese, English Synth) 👾': 'https://open.spotify.com/search/synthwave%20kpop%20jpop%20beats',
  'Paris Cafe & Urdu Ghazals (French, Urdu, English Acoustic) ☕': 'https://open.spotify.com/search/french%20acoustic%20urdu%20ghazal',
  'Global Chill Acoustic (Spanish, Hindi, English Indie) 🌿': 'https://open.spotify.com/search/spanish%20hindi%20english%20acoustic%20indie',
  'Punjabi Car Beats & Phonk (Punjabi, English, Haryanvi Rap) 🚗': 'https://open.spotify.com/search/punjabi%20phonk%20car%20beats',
  'Coke Studio Mashups (Urdu, Punjabi, Sindhi, Balochi Folk) 🎤': 'https://open.spotify.com/search/coke%20studio%20pakistan%20all%20languages',
  'Spanish Reggaeton & Desi Hip-Hop (Spanish, Hindi, Punjabi) 💃': 'https://open.spotify.com/search/reggaeton%20desi%20hiphop',
  'Bollywood Monsoon Nostalgia (Hindi, Bengali, Tamil Melodies) ☕': 'https://open.spotify.com/search/bollywood%20monsoon%20songs%20hindi%20tamil',
  'Japanese Future Funk & Indie Rock (Japanese, Korean, English) 🎸': 'https://open.spotify.com/search/japanese%20future%20funk%20indie%20rock',
  'Latin Pop & K-HipHop Jams (Spanish, Korean, English Rap) 💃': 'https://open.spotify.com/search/latin%20pop%20k-hiphop%20rap',
  'Acoustic Folk Sunsets (Swedish, English, Hindi Acoustic) 🌿': 'https://open.spotify.com/search/swedish%20acoustic%20folk%20hindi',
  'Coke Studio & Rainy Classics (Urdu, Hindi, Punjabi) 🌧': 'https://open.spotify.com/search/coke%20studio%20rainy%20urdu%20hindi',
  'Nordic Indie & K-Indie Vibes (Swedish, Korean, English Indie) 🎹': 'https://open.spotify.com/search/swedish%20indie%20k-indie%20acoustic',
  'Upbeat Tokyo J-Pop & French House (Japanese, French, English Pop) 🛒': 'https://open.spotify.com/search/tokyo%20j-pop%20french%20house%20electro',
  'Spooky Synth & Dark Phonk (Russian, Punjabi, English Beats) 💀': 'https://open.spotify.com/search/spooky%20synth%20phonk%20bass',
  'Opera Beats & Punjabi Club Mashup (Italian, Spanish, Punjabi HipHop) 🎻': 'https://open.spotify.com/search/punjabi%20opera%20club%20remix',
  'Global High-BPM Disco (Spanish, Korean, Hindi, English House) ⚡': 'https://open.spotify.com/search/global%20disco%20house%20spanish%20korean',
  'Silly Cartoon Tunes & French Pop (French, English, Hindi Acoustic) 🤪': 'https://open.spotify.com/search/silly%20whimsical%20tunes%20french%20pop',
  'Energetic Phonk & Latin Hits (Spanish, Portuguese, Punjabi Phonk) 💥': 'https://open.spotify.com/search/brazilian%20phonk%20punjabi%20latino',
  'Spicy Bollywood & Spanish Salsa (Spanish, Hindi, English Beats) 🌶️': 'https://open.spotify.com/search/spicy%20bollywood%20spanish%20salsa%20renga',
  'Romantic Acoustic Symphony & Urdu Ghazals 🕯️': 'https://open.spotify.com/search/romantic%20acoustic%20symphony%20urdu%20ghazals',
  'Indie Lofi Sunset & Cosmic Sleep 🌟': 'https://open.spotify.com/search/indie%20lofi%20sunset%20cosmic%20sleep',
  'Noir Jazz Beats & Club Phonk 🎭': 'https://open.spotify.com/search/noir%20jazz%20beats%20club%20phonk'
};
