const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Queue a song')
        .addStringOption(option => option
            .setName('input')
            .setDescription('song name or link')
            .setRequired(true)),
    async execute(interaction) {
        const commandinput = interaction.options.getString('input');
        console.log("play command : " + commandinput)
    }
}