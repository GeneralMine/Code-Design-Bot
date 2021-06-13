module.exports = function (Discord, client, slashCommand) {
    const data = {
        name: 'ping',
        description: 'ping me',
        options: [],
    }
    const interact = (interaction) => {
        slashCommand.returnMessage(interaction, "Pong 🐧", false);
    }
    return {
        data,
        interact,
    }
}