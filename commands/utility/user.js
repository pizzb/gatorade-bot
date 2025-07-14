const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Check your user card'),
	async execute(interaction) {
		await interaction.deferReply();

		const embed = new EmbedBuilder()
			.setAuthor({
				name: `${interaction.user.displayName} ( @${interaction.user.username} )`,
				iconURL: `https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`,
			})
			.setTitle(`User Card`)
			.addFields(
				{
					name: `Display Name`,
					value: `${interaction.user.displayName}`,
					inline: true
				},
				{
					name: `Username`,
					value: `${interaction.user.username}`,
					inline: true
				},
				{
					name: `User ID`,
					value: `\`${interaction.user.id}\``,
					inline: true
				},
				{
					name: "Date Created",
					value: `${(interaction.user.createdAt).toString()}`,
					inline: true
				},
				{
					name: "Avatar URL",
					value: `\`https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png\``,
					inline: true
				},
			)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`)
			.setColor(`#99ff85`)
			.setTimestamp();

		await interaction.editReply({ "embeds": [embed] });
	},
};