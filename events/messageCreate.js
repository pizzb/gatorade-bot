const { Events } = require('discord.js');

const invitePhrases = ["invite", "server link", "discord link", "join link", "invite link", "how do i join"];
const inviteResponses = [
    "here", "take it", "this the one", "here u go", "don't waste it", "link below", "slide in", "join up", "use this"
];
const inviteLink = "https://discord.gg/dxrxBf8qk6";

const thanksPhrases = ["thank", "thx", "thanks", "ty", "thank you", "appreciate it"];
const thanksResponses = ["np", "no prob", "sure", "anytime", "don’t mention it", "ok", "yuh"];

const insultTriggers = [
    "dumb", "stupid", "idiot", "trash", "useless", "annoying", "bad bot", "worst bot"
];
const insultResponses = [
    "cry harder", "cope", "stay mad", "not my fault", "ur loss", "ok and", "get good", "better luck next time"
];

const complimentTriggers = ["smart", "cool", "nice", "good bot", "funny", "awesome", "helpful"];
const complimentResponses = ["ik", "i try", "stop it u", "blush", "ty", "ur cooler"];

const sorryTriggers = ["sorry", "my bad", "i apologize", "forgive me"];
const sorryResponses = ["ok then", "it's chill", "we good", "say less", "cool", "ight"];

const responses = [
    "real", "fr", "lol", "nah", "yeah", "ok", "bruh", "mid", "cope", "💀",
    "wild", "skill issue", "touch grass", "who asked", "not even", "say less",
    "common W", "crazy", "yikes", "zzz", "outta pocket", "you good", "ain’t no way",
    "go outside", "actual npc", "down bad", "caught in 4k", "you tried", "nah fam",
    "sus", "silent rn", "weak", "on god", "bet", "lmfao", "keep scrolling", "scroll harder"
];

const answers = [
    "yes", "no", "yeah", "nah", "yep", "nope", "absolutely", "never", "of course", "not a chance"
];

const personprefix = [
    "probably ", "definitely ", "absolutely ", "", "100% ", "clearly ", "lowkey ", "highkey ", "maybe ", "honestly "
];

const greetings = [
    "yo", "sup", "hey", "hello", "hi", "heyo", "yo fam", "what's up", "ay", "hol up", "hm", "yo yo"
];

const persons = [
    "you", "me", "no one", "everyone", "your mom", "the algorithm", "some guy", "a raccoon",
    "chatgpt", "my alt", "your alt", "my toaster", "this dude", "a bot", "a mod", "a rat"
];

const greetTriggers = ["hi ", "hello ", "hey ", "yo ", "sup ", "howdy ", "hiya ", "heyo ", "ay "];

const exclamations = [
    "whoa", "wow", "omg", "lmao", "wtf", "no way", "fr", "on god", "real", "bro", "dang", "holy", "tf"
];

const whatResponses = [
    "wdym", "nah explain", "say that again", "you tryna be smart", "what u mean", "what even", "that don’t make sense"
];

const whenResponses = [
    "soon", "not now", "eventually", "idk bro", "check back never", "whenever", "after you touch grass"
];

const whyResponses = [
    "because", "idk", "ask someone else", "i said what i said", "that’s how it be", "laziness", "just felt like it"
];

const howResponses = [
    "magic", "just trust", "youtube it", "skill", "don’t worry bout it", "been like that", "trial and error"
];

const whatAreYouResponses = [
    "im gatorade", "gatorade", "i am gatorade", "why dont u know me"
];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (!message.mentions.has(message.client.user)) return;

        await message.channel.sendTyping();

        const content = message.content.toLowerCase();
        let response = "";

        if (greetTriggers.some(trigger => content.startsWith(trigger))) {
            response = getRandom(greetings);

        } else if (invitePhrases.some(phrase => content.includes(phrase))) {
            response = `${getRandom(inviteResponses)} ${inviteLink}`;

        } else if (thanksPhrases.some(phrase => content.includes(phrase))) {
            response = getRandom(thanksResponses);

        } else if (insultTriggers.some(word => content.includes(word))) {
            response = getRandom(insultResponses);

        } else if (complimentTriggers.some(word => content.includes(word))) {
            response = getRandom(complimentResponses);

        } else if (sorryTriggers.some(word => content.includes(word))) {
            response = getRandom(sorryResponses);

        } else if (content.includes("who")) {
            response = getRandom(personprefix) + getRandom(persons);

        } else if (content.includes("what are you")) {
            response = getRandom(whatAreYouResponses);

        } else if (content.startsWith("what")) {
            response = getRandom(whatResponses);

        } else if (content.startsWith("when")) {
            response = getRandom(whenResponses);

        } else if (content.startsWith("why")) {
            response = getRandom(whyResponses);

        } else if (content.startsWith("how")) {
            response = getRandom(howResponses);

        } else if (
            content.endsWith("?") ||
            content.startsWith("is ") ||
            content.startsWith("do ") ||
            content.startsWith("are ")
        ) {
            response = getRandom(answers);

        } else if (exclamations.some(word => content.includes(word))) {
            response = getRandom([
                "real", "fr fr", "nah this wild", "deadass", "💀", "same", "crazy", "bro", "ok and", "yo what"
            ]);

        } else if (content.startsWith("say ")) {
            const sayContent = message.content.slice(4).trim();
            if (sayContent.includes("<@")) {
                response = "nah i'm not saying that";
            } else {
                response = sayContent || "say what";
            }

        } else if (content.match(/(shut up|stfu|die|kill yourself|kys)/)) {
            response = "nah u";

        } else {
            response = getRandom(responses);
        }

        await message.reply(
            {
                content: response,
                allowedMentions: { repliedUser: false, parse: [] }
            }
        );
    },
};
