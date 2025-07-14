const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Gatorade is ready!!! Logged in as ${client.user.tag}`);
	},
};