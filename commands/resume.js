//resume playing when paused
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume current song if the player is paused"),

    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guildId)

        //check if the bot is has songs in queue
        if (!queue || !queue.tracks)
        {
            return await interaction.reply("I'm not playing anything right now.");
        }

        //check if song is already playing
        if (queue.node.isPlaying()){
            return await interaction.reply("I'm already playing.")
        }else if (queue.node.isPaused()){
            // Resume the current song
            queue.node.resume();
            return await interaction.reply(`currently resumed ${queue.currentTrack.title} ▶`);
        }
    }
}