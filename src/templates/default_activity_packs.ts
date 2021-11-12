const defaultActivityPack1 = {
    id: 'AP1',
    title: 'The Classics',
    description: 'Fun party games and activities everyone should know.',
    activities: [
        {
            title: 'Drink The Beer',
            description:
                'Get a beer in the bar and drink it as fast as possible. The quickest person to empty their beer can get a free drink.',
            startTime: Date.now() + 60000,
        },
        {
            title: 'Get 2 Know',
            description:
                'Find <NAME> and explain at least two things about yourself.',
            startTime: Date.now() + 120000,
        },
        {
            title: 'Bong',
            description: 'Start a game of Beer pong with <RANDOM_NAME>.',
            startTime: Date.now() + 180000,
        },
        {
            title: 'Flipping Cups',
            description:
                'Form two teams, equal in players. With a drink filled in a cup, drink it, place it on the side of the table and flip it. The cup must be flipped and not fall over when landing on the table.',
            startTime: Date.now() + 240000,
        },
        {
            title: 'Never Have I Ever',
            description:
                'You know what this is about. Never have you ever done something without drinking :D',
            startTime: Date.now() + 300000,
        },
        {
            title: 'Straight Face',
            description:
                "When you've gotten drunk, you must keep a straight face and write sentences (inappropriate or funny) on small pieces of paper. The first one to lose their straight face, drinks.",
            startTime: Date.now() + 360000,
        },
    ],
};

const defaultActivityPack2 = {
    id: 'AP2',
    title: 'Standard Activities',
    description: 'Easy activities for everyone.',
    activities: [
        {
            title: 'Fishing Trip',
            description:
                'With a barrel full of water, fish an apple up without touching with your hands.',
            startTime: Date.now() + 60000,
        },
        {
            title: 'Keep your hat on',
            description:
                'Keep your hat on until next task. If you drop/lose your hat, you drink.',
            startTime: Date.now() + 120000,
        },
        {
            title: 'Music Singalong',
            description: "If you don't know the lyrics, drink.",
            startTime: Date.now() + 180000,
        },
        {
            title: 'Birth Month',
            description:
                'Convert the current time to month. If the month is your birth month, take a sip. Example: Clock is 11PM. the person is born in november. Takes a sip.',
            startTime: Date.now() + 240000,
        },
        {
            title: 'Rock, Paper, Scissors',
            description:
                '5 rounds of Rock, Paper, Scissors. Take a sip each round you lose.',
            startTime: Date.now() + 300000,
        },
        {
            title: 'Chair Dance',
            description: 'You all know this one. Take a shot when you lose.',
            startTime: Date.now() + 360000,
        },
    ],
};

const defaultActivityPack3 = {
    id: 'AP3',
    title: 'Liver Damage',
    description: 'An activity pack filled with fun drinking games.',
    activities: [
        {
            title: 'Limbo Shots',
            description: "Limbo, but drink every time it's your turn.",
            startTime: Date.now() + 60000,
        },
        {
            title: 'Meyer!',
            description: 'Two dice. Lose it and drink it.',
            startTime: Date.now() + 120000,
        },
        {
            title: 'Beer Bowling',
            description: '',
            startTime: Date.now() + 180000,
        },
        {
            title: 'Waterfall',
            description:
                'https://darksquaregames.com/app/waterfall-the-drinking-game/',
            startTime: Date.now() + 240000,
        },
        {
            title: 'Reversed Buffalo',
            description:
                'For the rest of the party, drink with your non-dominant hand. Whenever someone catches you drinking with your dominant hand, bottoms up.',
            startTime: Date.now() + 300000,
        },
        {
            title: 'Most likely to...',
            description:
                'A most-likely question is asked. Count to three and everyone points at the person most likely to X. Drink the amount of pointed fingers at you.',
            startTime: Date.now() + 360000,
        },
    ],
};

export const defaultActivityPacks = [
    defaultActivityPack1,
    defaultActivityPack2,
    defaultActivityPack3,
];
