const storage = require("../storage");

module.exports = {
    client: null,
    init,
    checkReactionAdd,
    checkMessageUpdate,
    refresh
}

async function init(client) {
    this.client = client;
}

function checkReactionAdd(messageReaction, user) {
    let rcp = storage.rcp[messageReaction.message.id];
    if (rcp) {
        console.log("Triggered: ", messageReaction.message.id);
    } else {
        console.log("Not my message");
    }
}

function checkMessageUpdate(oldMessage, newMessage) {
    let rcp = storage.rcp[oldMessage.id];
    if (rcp) {
        this.refresh(oldMessage.id);
    } else {
        console.log("Not my message");
    }
}

async function refresh(id) {
    let rcp = storage.rcp[id];

    try {
        const server = await this.client.guilds.resolve(rcp.guildID);
        const channel = await server.channels.resolve(rcp.channelID);
        const message = await channel.messages.fetch(id);
        // Get Poll Groups
        console.log("Parse: ", message.content);
        let contentList = message.content.split(":\n")[1].split("\n").map(el => {
            return {
                emoji: el.split(" ")[0],
                name: el.split("**")[1].trim(),
                description: el.split("-")[1].trim(),
                mention: el.split("-")[2].trim()
            };
        });
        for (const contentEntry of contentList) {
            if (rcp.groups === undefined)
                rcp.groups = {}
            if (rcp.groups[contentEntry.emoji] === undefined)
                rcp.groups[contentEntry.emoji] = {}
            rcp.groups[contentEntry.emoji].name = contentEntry.name;
            rcp.groups[contentEntry.emoji].description = contentEntry.description;
            rcp.groups[contentEntry.emoji].mention = contentEntry.mention;
        }

        for (const [groupEmoji, group] of Object.entries(rcp.groups)) {
            console.log("Group: " + groupEmoji + ": ", group);

            // Groupreaction
            message.react(groupEmoji);

            // Create GroupChannel if group hasnt already one!
            console.log("Channel: " + group.channelID, await server.channels.resolve(group.channelID));
            if (await server.channels.resolve(group.channelID) == null) {
                let groupChannel = await server.channels.create(rcp.label + "-" + group.name, { parent: message.channel.parent });
                group.channelID = groupChannel.id;
            }
        }

        rcp.lastRefreshed = new Date();
    }
    catch (e) {
        console.error(e);
        return e;
    }
    console.log("Successfully refreshed " + id);
}
