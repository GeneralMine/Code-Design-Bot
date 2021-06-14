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
            {
                name: "label",
                description: "label for the poll. will be the prefix for the channels",
                type: 3,
                required: true,
            },
        ],
    }

    const interact = async (interaction) => {
        slashCommand.returnMessage(interaction, null, true);

        storage.rcp[interaction.data.options[0].value] = {
            guildID: interaction.guild_id,
            channelID: interaction.channel_id,
            label: interaction.data.options[1].value
        };

        await rcpController.refresh(interaction.data.options[0].value);

        await slashCommand.editOriginalInteractionResponse(interaction, "Successfully registered reaction-channel-poll!").then(() => {
            setTimeout(() => {
                slashCommand.deleteOriginalInteractionResponse(interaction)
            }, 5000)
        });
    }

    return {
        data,
        interact,
    }
}