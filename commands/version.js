require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Returns current bot version'),
    execute: async ({client, interaction}) => {
        await interaction.reply("The bots current version is : " + process.env.BOT_VERSION);
    }
}