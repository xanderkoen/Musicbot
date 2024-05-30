//skip current song playing
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, EmbedBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),

    execute: async ({ client, interaction }) => {

        // Get the queue for the server
        const queue = client.player.queues.get(interaction.guildId)

        // If there is no queue, return
        if (!queue)
        {
            await interaction.reply("There are no songs in the queue");
            return;
        }

        const currentSong = queue.currentTrack

        // Skip the current song
        queue.node.skip();

        // Return an embed to the user saying the song has been skipped
        const embed = new EmbedBuilder()
            .setDescription(`${currentSong.title} has been skipped!`)

        return interaction.reply({embeds: [embed]});
    },
}