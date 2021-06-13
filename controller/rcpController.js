const { rcp } = require("../storage");
const storage = require("../storage");

module.exports = {
    client: null,
    checkTriggered,
    parseMessage,
    init,
    refresh
}

async function init(client) {
    this.client = client;
}

function checkTriggered(messageReaction, user) {
    let hits = storage.rcp.filter(el => el.id === messageReaction.message.id);
    console.log("checkTriggered: ", hits);
}

async function refresh(id) {
    let lastElement = storage.rcp[id];
    let groups;
    try {
        await this.client.guilds
            .resolve(lastElement.guildID)
            .channels.resolve(lastElement.channelID)
            .messages.fetch(lastElement.messageID)
            .then((m) => {
                groups = parseMessage(m.content);
            });
    } catch (e) {
        console.error(e);
        return e;
    }

    console.log("Groups: ", groups);
}

function parseMessage(content) {
    groups = content.split(":\n")[1].split("\n").map(el => {
        return {
            emoji: el.split(" ")[0],
            name: el.split("**")[1],
            description: el.split("-")[1].trim(),
            mention: el.split("-")[2].trim()
        };
    });
}
