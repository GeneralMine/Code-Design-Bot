const storage = require("../../storage");
const rcpController = require("../../controller/rcpController");

module.exports = function (Discord, client, slashCommand) {
    const data = {
        name: 'register-reaction-channel-poll',
        description: 'register a reaction-channel-poll',
        options: [
            {
                name: "messageid",
                description: "the id of the message",
                type: 3,
                required: true,
            },
        ],
    }

    const interact = async (interaction) => {
        slashCommand.returnMessage(interaction, null, true);
        storage.rcp.push({
            guildID: interaction.guild_id,
            channelID: interaction.channel_id,
            messageID: interaction.data.options[0].value
        });

        await rcpController.refresh(storage.rcp.length - 1);

        await slashCommand.editOriginalInteractionResponse(interaction, "Successfully registered reaction-channel-poll!");
    }

    return {
        data,
        interact,
    }
}