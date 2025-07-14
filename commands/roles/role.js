const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Commands relating to server roles')
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Create a custom role for yourself')
				.addStringOption(option =>
					option
						.setName('prefix').setDescription('Prefix of the role, specifically a symbol or an emoji.')
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName('name').setDescription('Name of the role')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a specific role from yourself')
				.addRoleOption(option =>
					option
						.setName('role').setDescription('The role you want to remove')
						.setRequired(true)
				)
		),
	async execute(interaction) {
		let subcom = interaction.options.getSubcommand()
		await interaction.deferReply();
		await interaction.editReply({ content: `Loading...\n-# If this message doesn't change, try again.` });
		try {
			if (interaction.guild.id != 1005667501885104198) {
				return interaction.editReply({ content: `Sorry, but that command is limited to NO NAME.` });
			}
			if (subcom == "create") {
				const prefix = interaction.options.getString('prefix');
				const name = interaction.options.getString('name');
				const fullRoleName = `${prefix} | ${name}`;
				if (fullRoleName.length > 100) {return interaction.editReply({ content: `Oops, the name you provided me is too long` })}
				const guild = interaction.guild;
				const member = interaction.member;

				// Check if role already exists
				let role = guild.roles.cache.find(r => r.name === fullRoleName);

				if (!role) {
					role = await guild.roles.create({
						name: fullRoleName,
						reason: `Custom role requested by ${member.user.tag}`,
					});
				} else {
					return interaction.editReply({ content: `That role already exists` });
				}

				// Try assigning the role to the user
				await member.roles.add(role);
				await interaction.editReply({ content: `Successfully created the role \`@${fullRoleName}\`!` });
			} else if (subcom == "remove") {
				const role = interaction.options.getRole('role');
				const member = interaction.member;

				if (!member.roles.cache.has(role.id)) {
					return interaction.editReply({ content: `Oops, looks like you don’t have the role \`@${role.name}\`` });
				}

				await member.roles.remove(role);
				await interaction.editReply({ content: `Successfully removed the role \`@${role.name}\` from your profile` });
			}
		} catch (error) {
			await interaction.editReply({ content: `:warning: An error has occured\n-# Report this to <@890459354543837234>\n\`\`\`ansi\n[2;31m${error}[0m\n\`\`\`` });
		}
	},
};