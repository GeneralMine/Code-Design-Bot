/**
 * Props an @g4bri3l.de
 */

module.exports = function (Discord, client, logger = console) {
	const getApp = (guildId) => {
		const app = client.api.applications(client.user.id)
		if (guildId) {
			app.guilds(guildId)
		}
		return app
	}
	/**
	 * Gets commands already registered on guild
	 * @param guildId {string}
	 * @returns {Promise}
	 */
	const getCommands = async (guildId) => {
		return getApp(guildId).commands.get()
	}
	const getPermissions = async (guildId) => {
		return getApp(guildId).commands.permissions.get()
	}

	const createAPIMessage = async (interaction, content) => {
		const { data, files } = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content).resolveData().resolveFiles()
		return { ...data, files }
	}
	/**
	 *
	 * @param interaction - The interaction from the webhook listener
	 * @param response  - The Message the bot should respond with
	 * @returns {Promise<void>}
	 */
	const returnMessage = async (interaction, response, deferred) => {
		let data = {
			content: response,
		}
		if (typeof response === 'object') {
			data = await createAPIMessage(interaction, response)
		}
		client.api
			.interactions(interaction.id, interaction.token)
			.callback.post({
				data: {
					type: deferred ? 5 : 4,
					data,
				},
			})
			.then(() => {
				logger.info('User ' + interaction.member.user.username + ' used command ' + interaction.data.name)
			})
	}
	const getOriginalInteractionResponse = async (interaction) => {
		return client.api.webhooks(process.env.DISCORD_APP_ID, interaction.token).messages('@original').get()
	}
	const editOriginalInteractionResponse = async (interaction, res) => {
		let data = {
			content: res,
		}
		if (typeof res === 'object') {
			data = await createAPIMessage(interaction, res)
		}
		//todo handle embeds better
		return client.api.webhooks(process.env.DISCORD_APP_ID, interaction.token).messages('@original').patch({
			data,
		})
	}
	const deleteOriginalInteractionResponse = async (interaction) => {
		return client.api.webhooks(process.env.DISCORD_APP_ID, interaction.token).messages('@original').delete().catch(e => logger.log(e))
	}
	const createFollowupMessage = async (interaction, res) => {
		let data = {
			content: res,
		}
		if (typeof res === 'object') {
			data = await createAPIMessage(interaction, res)
		}
		return client.api.webhooks(process.env.DISCORD_APP_ID, interaction.token).post({ data })
	}
	const editFollowupMessage = async (interaction, followupMessage, res) => {
		let data = {
			content: res,
		}
		if (typeof res === 'object') {
			data = await createAPIMessage(interaction, res)
		}
		return client.api.webhooks(process.env.DISCORD_APP_ID, interaction.token).messages(followupMessage.id).patch({ data })
	}
	const deleteFollowupMessage = async (interaction, followupMessage) => {
		return client.api.webhooks(process.env.DISCORD_APP_ID, interaction.token).messages(followupMessage.id).delete()
	}

	/**
	 *
	 * @param commands{Object[]} - Array of commands to sync
	 * @param testGuilds {string[]}- Array of guilds in which the commands should be synced
	 * @returns {Promise<void>}
	 */
	const syncCommands = async (commands, testGuilds) => {
		for (const guildId of testGuilds) {
			getCommands(guildId).then((guildCommands) => {
				// logger.log( guildCommands)
				const commandsToSync = commands.filter((comm) => guildCommands.findIndex((comma) => comma.name === comm.name) === -1)
				// logger.log(commandsToSync)
				for (const command of commandsToSync) {
					logger.log({ data: command })
					getApp(guildId).commands.post({ data: command })
				}
			})
		}
	}
	const updateCommands = async (commands, guilds) => {
		// logger.log(commands)
		for (const guildId of guilds) {
			for (const command of commands) {
				getApp(guildId).commands.post({ data: command })
			}
		}
	}
	const deleteCommands = async (commands, guilds) => {
		for (const guildId of guilds) {
			getCommands(guildId).then(guildCommands => {
				const commandsToDelete = guildCommands.filter(comm => commands.includes(comm.name))
				for (const commandToDelete of commandsToDelete) {
					getApp(guildId).commands(commandToDelete.id).delete()
				}
			})
		}
	}
	const updateCommandPermissions = async (commands, guilds) => {
		const commandsWithPermissions = commands.filter(command => command.permissions && command.permissions.length > 0)
		// logger.log(commandsWithPermissions)
		for (const guild of guilds) {
			getCommands(guild).then(guildCommands => {
				for (const commandWithPermission of commandsWithPermissions) {
					const command = guildCommands.filter(c => c.name === commandWithPermission.name)
					if (command.length > 0) {
						logger.log(JSON.stringify({ permissions: commandWithPermission.permissions }))
						getApp(guild).commands(command[0].id).permissions.put(null, JSON.stringify({ permissions: commandWithPermission.permissions }))
					}
				}
			})
		}
	}
	const messagePin = async (interaction, pin) => {
		try {
			await client.guilds
				.resolve(interaction.guild_id)
				.channels.resolve(interaction.channel_id)
				.messages.fetch(interaction.data.options[0].value)
				.then((m) => {
					m.pin()
					pin ? m.pin() : m.unpin()
					returnMessage(interaction, pin ? 'Message pinned' : 'Message unpinned')
				})
		} catch (e) {
			logger.error(e)
			await returnMessage(interaction, pin ? 'Message could not be pinned' : 'Message could not be unpinned')
		}
	}
	return {
		getApp,
		getCommands,
		returnMessage,
		syncCommands,
		updateCommands,
		deleteCommands,
		messagePin,
		getOriginalInteractionResponse,
		editOriginalInteractionResponse,
		deleteOriginalInteractionResponse,
		createFollowupMessage,
		editFollowupMessage,
		deleteFollowupMessage,
		getPermissions,
		updateCommandPermissions
	}
}
