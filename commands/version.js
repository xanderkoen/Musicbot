require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Returns current bot version'),
    async execute(interaction) {
        await interaction.reply("The bots current version is : " + process.env.BOT_VERSION);
    }
}