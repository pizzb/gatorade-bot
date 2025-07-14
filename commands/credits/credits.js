const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Commands relating to credits')
	.addSubcommand(subcommand =>
		subcommand
			.setName('top')
			.setDescription('Check the credits leaderboard'))
	.addSubcommand(subcommand =>
		subcommand
			.setName('work')
			.setDescription('Work for credits')),
	async execute(interaction) {
		
	},
};