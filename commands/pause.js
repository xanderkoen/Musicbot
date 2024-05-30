//pause current song playing
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause current song playing"),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guildId)

        //check if the bot is playing
        if (!queue || !queue.tracks)
        {
            return await interaction.reply("I'm not playing anything right now.");
        }

        //check if song is already paused
        if (queue.node.isPaused()){
            return await interaction.reply("I'm already paused.")
        }

        // Pause the current song
        queue.node.pause();

        interaction.reply(`currently paused ${queue.currentTrack.title} ⏸`);
    }
}