const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const kvstore = require('../../data-handler.js')

let cdwork = new kvstore('cdCreditsWork.json')

let workAmt = new kvstore('CreditsWorkAmount.json')
let DailyData = new kvstore('CreditsDaily.json')

let cdsteal = new kvstore('cdCreditsSteal.json')
let creditData = new kvstore('credits.json')

let guardData = new kvstore('creditguard.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Commands relating to credits')
		.addSubcommand(subcommand =>
			subcommand
				.setName('top')
				.setDescription('Check the credits leaderboard')
				.addIntegerOption(option =>
					option
						.setName('filter')
						.setDescription('What types of profiles to be included in the leaderboard')
						.addChoices(
							{ name: 'Users Only', value: 0 },
							{ name: 'Banks Only', value: 1 },
							{ name: 'Users and Banks', value: 2 },
						)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('guard')
				.setDescription('Protect yourself from stealers for 30 minutes')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('daily')
				.setDescription('Claim your daily bonus')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('check')
				.setDescription('Check how many credits a person has')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user you want to check')
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('work')
				.setDescription('Work for credits')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('steal')
				.setDescription('Steal someone else\'s credits')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user you want to steal from')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('give')
				.setDescription('Give credits to someone else')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user you want to give credits to')
						.setRequired(true)
				)
				.addIntegerOption(option =>
					option
						.setName('amount')
						.setDescription('Amount of credits you want to give')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('burn')
				.setDescription('Destroy your credits')
				.addIntegerOption(option =>
					option
						.setName('amount')
						.setDescription('Amount of credits you want to burn')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('stealcheck')
				.setDescription('Check your chances with stealing from someone else')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('The user you want to steal from')
						.setRequired(true)
				)
		),
	async execute(interaction) {
		let subcom = interaction.options.getSubcommand()
		await interaction.deferReply();
		await interaction.editReply({ content: `Loading...\n-# If this message doesn't change, try again.` });
		const today = new Date().toISOString().split('T')[0];
		const currentUnix = Math.floor(Date.now() / 1000)
		try {
			if (interaction.guild.id != 1005667501885104198) {
				return interaction.editReply({ content: `Sorry, but that command is limited to NO NAME.` });
			}
			const globalBank = creditData.get("1017334019878297650") || 0
			if (subcom == "check") {
				const target = interaction.options.getUser('user') || interaction.user;

				var embedTitle = "Credits Card"
				if (target.bot) { embedTitle = "Bank" }

				var creditsAmount = creditData.get(target.id) || 0
				creditData.set(target.id, creditsAmount)

				const embed = new EmbedBuilder()
					.setAuthor({
						name: `${target.displayName} ( @${target.username} )`,
						iconURL: `https://cdn.discordapp.com/avatars/${(target.id).replace(/\D/g, "")}/${target.avatar}.png`,
					})
					.setTitle(`${embedTitle}`)
					.addFields(
						{
							name: `Credits`,
							value: `\`${creditsAmount}\``,
							inline: true
						}
					)
					.setThumbnail(`https://cdn.discordapp.com/avatars/${(target.id).replace(/\D/g, "")}/${target.avatar}.png`)
					.setColor(`#99ff85`)
					.setTimestamp();

				await interaction.editReply({ content: ``, embeds: [embed] })

			} else if (subcom == "daily") {
				var lastClaim = DailyData.get(interaction.user.id) || "non"
				if (lastClaim == today) {
					return interaction.editReply({ content: `You already claimed your daily bonus for today` })
				}

				DailyData.set(interaction.user.id, today)
				var currentCredits = creditData.get(interaction.user.id) || 0

				creditData.set(interaction.user.id, Number(Number(currentCredits) + 1000))

				const embed = new EmbedBuilder()
					.setAuthor({
						name: `${interaction.user.displayName} ( @${interaction.user.username} )`,
						iconURL: `https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`,
					})
					.setTitle("💸 Daily Claimed!")
					.setDescription(`You have gained \`1000\` credits for claiming your today's daily bonus!`)
					.addFields(
						{
							name: `${interaction.user.displayName}'s Credits`,
							value: `\`${currentCredits}\` → \`${Number(currentCredits) + 1000}\``,
							inline: false
						},
					)
					.setThumbnail(`https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`)
					.setColor(`#99ff85`)
					.setTimestamp();

				await interaction.editReply({ content: ``, embeds: [embed] })
			} else if (subcom == "work") {
				var cooldown = cdwork.get(interaction.user.id) || 0
				// cooldown is the required unix time so that the command can be done again
				if (currentUnix < cooldown) {
					return interaction.editReply({ content: `Calm down! You can work again <t:${cooldown}:R>` })
				}
				cdwork.set(interaction.user.id, Number(currentUnix) + 300)
				var lastWorkDay = workAmt.get("Date") || "non"
				if (lastWorkDay != today) {
					workAmt.clear()
					workAmt.set("Date", today)
				}

				var workTimes = Number((workAmt.get(interaction.user.id) || 0)) + 1
				workAmt.set(interaction.user.id, workTimes)
				var creditsGain = workTimes * 50

				var currentCredits = creditData.get(interaction.user.id) || 0
				var tax = Math.min((Number(currentCredits) / Number(globalBank)) / 2, 1)
				var taxDisplay = Math.floor(Number(tax) * 10000) / 100

				var creditsBankGain = Math.floor(Number(tax) * Number(creditsGain))
				var creditsUserGain = Number(creditsGain) - Number(creditsBankGain)

				creditData.set(interaction.user.id, Number(Number(currentCredits) + Number(creditsUserGain)))
				creditData.set("1017334019878297650", Number(Number(globalBank) + Number(creditsBankGain)))

				const embed = new EmbedBuilder()
					.setAuthor({
						name: `${interaction.user.displayName} ( @${interaction.user.username} )`,
						iconURL: `https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`,
					})
					.setTitle("💼 You worked!")
					.setDescription(`You have made \`${creditsGain}\` credits for working hard \`${workTimes}\` time(s) today!\n\n\`${creditsBankGain}\` credits will given to the bank. (${taxDisplay}% bank tax)\n\`${creditsUserGain}\` credits will be kept for you.`)
					.addFields(
						{
							name: `${interaction.user.displayName}'s Credits`,
							value: `\`${currentCredits}\` → \`${Number(currentCredits) + Number(creditsUserGain)}\``,
							inline: true
						},
						{
							name: "Global Bank Credits",
							value: `\`${globalBank}\` → \`${Number(globalBank) + Number(creditsBankGain)}\``,
							inline: true
						},
					)
					.setThumbnail(`https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`)
					.setColor(`#99ff85`)
					.setTimestamp();

				await interaction.editReply({ content: ``, embeds: [embed] })
			} else if (subcom == "give") {
				// wip
				const target = interaction.options.getUser('user') || "nouser";
				if (target == "nouser") {
					return interaction.editReply({ content: `You didn't provide a user to give to` })
				}
				if (target == interaction.user) {
					return interaction.editReply({ content: `You can't give yourself credits!` })
				}
				const amount = Number(interaction.options.getInteger('amount'))

				var userCredits = Number(creditData.get(interaction.user.id))
				var targetCredits = Number(creditData.get(target.id))

				if (amount < 0) {
					return interaction.editReply({ content: `You can't give someone negative credits!` })
				}
				if (amount == 0) {
					return interaction.editReply({ content: `You can't give someone no credits!` })
				}
				if (amount > userCredits) {
					return interaction.editReply({ content: `You don't have that much credits to give` })
				}

				creditData.set(interaction.user.id, userCredits - amount)
				creditData.set(target.id, targetCredits + amount)

				const embed = new EmbedBuilder()
					.setAuthor({
						name: `${interaction.user.displayName} and ${target.displayName}`,
						iconURL: `https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`,
					})
					.setTitle("💸 Transaction Completed!")
					.setDescription(`<@${interaction.user.id}> has successfully given \`${amount}\` credits to <@${target.id}>'s profile.`)
					.addFields(
						{
							name: `${interaction.user.displayName}'s Credits`,
							value: `\`${userCredits}\` → \`${userCredits - amount}\``,
							inline: true
						},
						{
							name: `${target.displayName}'s Credits`,
							value: `\`${targetCredits}\` → \`${targetCredits + amount}\``,
							inline: true
						},
					)
					.setThumbnail(`https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`)
					.setColor(`#99ff85`)
					.setTimestamp();

				await interaction.editReply({ content: `Transaction completed between <@${interaction.user.id}> and <@${target.id}>`, embeds: [embed] })
			} else if (subcom == "burn") {
				const amount = Number(interaction.options.getInteger('amount'))
				var userCredits = Number(creditData.get(interaction.user.id))

				if (amount > userCredits) {
					return interaction.editReply({ content: `You don't have that much credits to burn` })
				}

				creditData.set(interaction.user.id, userCredits - amount)

				const embed = new EmbedBuilder()
					.setAuthor({
						name: `${interaction.user.displayName} ( @${interaction.user.username} )`,
						iconURL: `https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`,
					})
					.setTitle("🔥 Credits Burned!")
					.setDescription(`You have burned \`${amount}\` credits.`)
					.addFields(
						{
							name: `${interaction.user.displayName}'s Credits`,
							value: `\`${userCredits}\` → \`${userCredits - amount}\``,
							inline: true
						}
					)
					.setThumbnail(`https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`)
					.setColor(`#99ff85`)
					.setTimestamp();

				await interaction.editReply({ content: ``, embeds: [embed] })
			} else if (subcom == "steal") {
				const target = interaction.options.getUser('user') || "nouser";
				if (target == "nouser") {
					return interaction.editReply({ content: `You didn't provide a user to steal from` })
				}
				if (target == interaction.user) {
					return interaction.editReply({ content: `You can't steal from yourself` })
				}

				var userCredits = Number(creditData.get(interaction.user.id)) || 0
				var targetCredits = Number(creditData.get(target.id)) || 0

				if (userCredits < Math.floor(globalBank * 0.05)) {
					return interaction.editReply({ content: `You need at least ${Math.floor(globalBank * 0.05)} credits in order to steal. (5% of the global bank's)` })
				}
				if (targetCredits <= 0) {
					return interaction.editReply({ content: `You're trying to steal from someone who doesn't have any credits` })
				}

				var cooldown = cdsteal.get(interaction.user.id) || 0
				if (currentUnix < cooldown) {
					return interaction.editReply({ content: `Calm down! You can steal again <t:${cooldown}:R>` })
				}
				cdsteal.set(interaction.user.id, Number(currentUnix) + 600)

				var guardTime = guardData.get(target.id) || 0

				var chance = Math.min((userCredits / (targetCredits * 0.8)), 1) * Math.min((targetCredits / (globalBank * 0.8)), 1)
				if (target.bot) { chance = chance * 0.1 }
				chance = Math.sqrt(chance)
				if (currentUnix < guardTime) { chance = chance * 0.3 }

				var chanceDisplay = Math.floor(chance * 10000) / 100
				var amountPercentage = (Math.random() * 0.3) + 0.2

				if (Math.random() <= chance) {
					// steal success
					var amount = Math.floor(amountPercentage * targetCredits)
					creditData.set(interaction.user.id, userCredits + amount)
					creditData.set(target.id, targetCredits - amount)

					const embed = new EmbedBuilder()
						.setAuthor({
							name: `${interaction.user.displayName} ( @${interaction.user.username} )`,
							iconURL: `https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`,
						})
						.setTitle("🤑 You successfully stole credits!")
						.setDescription(`Nice! You successfully stole \`${amount}\` credits from <@${target.id}>'s wallet!`)
						.addFields(
							{
								name: `${interaction.user.displayName}'s Credits`,
								value: `\`${userCredits}\` → \`${userCredits + amount}\``,
								inline: true
							},
							{
								name: `${target.displayName}'s Credits`,
								value: `\`${targetCredits}\` → \`${targetCredits - amount}\``,
								inline: true
							}
						)
						.setThumbnail(`https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`)
						.setColor(`#99ff85`)
						.setFooter({
							text: `${chanceDisplay}% success rate`,
						})
						.setTimestamp();

					await interaction.editReply({ content: ``, embeds: [embed] })
				} else {
					// steal unsuccessful
					var amount = Math.floor(amountPercentage * userCredits)
					creditData.set(interaction.user.id, userCredits - amount)
					creditData.set("1017334019878297650", globalBank + amount)

					const embed = new EmbedBuilder()
						.setAuthor({
							name: `${interaction.user.displayName} ( @${interaction.user.username} )`,
							iconURL: `https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`,
						})
						.setTitle("🔐 You got caught stealing!")
						.setDescription(`Oh no! You got caught snatching <@${target.id}>'s credits in plain sight! You have been given a fine of \`${amount}\` credits.`)
						.addFields(
							{
								name: `${interaction.user.displayName}'s Credits`,
								value: `\`${userCredits}\` → \`${userCredits - amount}\``,
								inline: true
							},
							{
								name: `Global Bank Credits`,
								value: `\`${globalBank}\` → \`${globalBank + amount}\``,
								inline: true
							}
						)
						.setThumbnail(`https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`)
						.setColor(`#f24a4a`)
						.setFooter({
							text: `${chanceDisplay}% success rate`,
						})
						.setTimestamp();

					await interaction.editReply({ content: ``, embeds: [embed] })
				}

			} else if (subcom == "stealcheck") {
				const target = interaction.options.getUser('user') || "nouser";
				if (target == "nouser") {
					return interaction.editReply({ content: `You didn't provide a user to stealcheck` })
				}
				var userCredits = Number(creditData.get(interaction.user.id)) || 0
				var targetCredits = Number(creditData.get(target.id)) || 0

				var guardTime = guardData.get(target.id) || 0

				var chance = Math.min((userCredits / (targetCredits * 0.8)), 1) * Math.min((targetCredits / (globalBank * 0.8)), 1)
				if (target.bot) { chance = chance * 0.1 }
				chance = Math.sqrt(chance)
				if (currentUnix < guardTime) { chance = chance * 0.3 }

				var cooldown = cdsteal.get(interaction.user.id) || 0

				var chanceDisplay = Math.floor(chance * 10000) / 100

				var stealcooldowntext = "You currently do not have a cooldown on stealing."
				if (currentUnix < cooldown) {
					stealcooldowntext = `Your steal cooldown ends <t:${cooldown}:R>`
				}

				var usertypetext = "person"
				if (target.bot) {
					usertypetext = "bank"
				}

				var guardWarning = ``
				if (currentUnix < guardTime) {
					guardWarning = `\n:shield: They currently have a **guard** that expires in <t:${guardTime}:R>`
				}

				var botWarning = ``
				if (target.bot) {
					botWarning = `\n:robot: This is a bank, success rate is lowered`
				}

				await interaction.editReply({ content: `${stealcooldowntext}\nYou have a ${chanceDisplay}% success rate if you were to steal from that ${usertypetext} right now.\n${guardWarning}${botWarning}` })
			} else if (subcom == "top") {
				const filter = interaction.options.getInteger('filter') || 0;

				const sortedEntries = Object.entries(creditData.all()).sort((a, b) => b[1] - a[1]);

				let description = '';
				var top = Math.min(sortedEntries.length, 20);

				// Figure out the longest credit amount to align nicely
				const maxCreditLength = sortedEntries[0][1].toString().length;

				var filtertext = "Users Only"
				if (filter == 0) {
					filtertext = "Users Only"
				} else if (filter == 1) {
					filtertext = "Banks Only"
				} else {
					filtertext = "Users and Banks"
				}

				var topUser
				var j = 0
				for (var i = 0; i < top; i++) {
					const rank = String(j + 1).padStart(2, '0'); // "01", "02", ..., "10"
					const userId = sortedEntries[i][0];
					const credits = String(sortedEntries[i][1]).padStart(maxCreditLength, ' '); // align numbers
					const lbUser = await interaction.client.users.fetch(sortedEntries[i][0])

					var acceptUser = false
					if (filter == 0) {
						if (!lbUser.bot) { acceptUser = true }
					} else if (filter == 1) {
						if (lbUser.bot) { acceptUser = true }
					} else {
						acceptUser = true
					}
					if (acceptUser) {
						description = `${description}**\`#${rank}\`** \`${credits}\` <@${userId}>\n`;
						if (!topUser) { topUser = lbUser }
						j++
					}
				}


				const usersButton = new ButtonBuilder()
					.setCustomId('creditstop0')
					.setLabel('Users')
					.setStyle(ButtonStyle.Secondary);
				const banksButton = new ButtonBuilder()
					.setCustomId('creditstop1')
					.setLabel('Banks')
					.setStyle(ButtonStyle.Secondary);
				const bothButton = new ButtonBuilder()
					.setCustomId('creditstop2')
					.setLabel('Both')
					.setStyle(ButtonStyle.Secondary);

				const ctme = new ActionRowBuilder()
					.addComponents(usersButton, banksButton, bothButton);


				const embed = new EmbedBuilder()
					//.setAuthor({
					//name: `${interaction.user.displayName} ( @${interaction.user.username} )`,
					//iconURL: `https://cdn.discordapp.com/avatars/${(interaction.user.id).replace(/\D/g, "")}/${interaction.user.avatar}.png`,
					//})
					.setTitle("💹 Credits Leaderboard")
					.setDescription(`${filtertext}\n\n${description}`)
					.setThumbnail(`https://cdn.discordapp.com/avatars/${(topUser.id).replace(/\D/g, "")}/${topUser.avatar}.png`)
					.setColor(`#99ff85`)
					.setTimestamp();

				await interaction.editReply({ content: ``, embeds: [embed], components: [ctme] })
			} else if (subcom == "guard") {
				guardData.set(interaction.user.id, Number(currentUnix) + 3600)

				await interaction.editReply({ content: `:shield: Your guard has been renewed and will last until it expires <t:${Number(currentUnix) + 3600}:R>` })
				//wip
			} else {
				await interaction.editReply({ content: `Sadly, that command doesn't work yet.` })
			}
		} catch (error) {
			await interaction.editReply({ content: `:warning: An error has occured\n-# Report this to <@890459354543837234>\n\`\`\`ansi\n[2;31m${error}[0m\n\`\`\`` });
		}
	},
};