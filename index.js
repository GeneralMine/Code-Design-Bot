require('dotenv').config();
const Discord = require('discord.js');
const fs = require("fs");
const path = require("path");

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
const slashcommand = require("./slashcommand")(Discord, client);
const rcpController = require("./controller/rcpController");
const storage = require("./storage");

const commandFolder = path.join(__dirname, './commands');
const commandFolders = fs.readdirSync(commandFolder);
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`${commandFolder}/${folder}`).filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
        const command = require(`${commandFolder}/${folder}/${file}`)(Discord, client, slashcommand);
        client.commands.set(command.data.name.toLowerCase(), command);
    }
}

const guildIDs = ["788434574538440726", "693513558427697214"];

async function main() {

    await storage.init();
    await rcpController.init(client);


    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log("Connected to:");
        client.guilds.cache.forEach(g => {
            console.log(" - " + g.name)
        });
        slashcommand.syncCommands(
            client.commands.array().map((command) => command.data),
            guildIDs
        ).then(() => console.log('Commands synced'));
        // slashcommand.updateCommands(client.commands.array().map((command) => command.data).filter(c => c.name === 'register-reaction-channel-poll'), guildIDs).then(() => console.log("Commands updated"));

    });

    client.on('messageReactionAdd', async (messageReaction, user) => {
        // When a reaction is received, check if the structure is partial
        if (messageReaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await messageReaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message: ', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        rcpController.checkReactionAdd(messageReaction, user);
    });

    client.on("messageUpdate", async (oldMessage, newMessage) => {
        rcpController.checkMessageUpdate(oldMessage, newMessage);

    });

    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const command = interaction.data.name.toLowerCase()
        if (!client.commands.has(command)) {
            returnMessage(interaction, 'Interaction not implemented yet')
        } else {
            try {
                client.commands.get(command).interact(interaction);
            } catch (e) {
                console.log.error(e);
            }
        }
    })

    client.login(process.env.TOKEN);

}
main();