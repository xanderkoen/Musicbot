//leave voice call
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Kick the bot from the channel."),
    execute: async ({ client, interaction }) => {

        // Get the current queue
        const queue = client.player.queues.get(interaction.guildId)

        if (queue)
        {
            // Deletes all the songs from the queue and exits the channel
            queue.delete();
            return await interaction.reply(`Left the voice channel - requested by <@${interaction.user.id}>`);
        }

        // Check if the bot is currently in a voice channel
        if (interaction.guild.me) {
            const voiceChannel = interaction.guild.me.voice.channel;
            if (voiceChannel) {
                // Leave the voice channel if the bot is in one
                await interaction.guild.me.voice.disconnect()
            }
        }

        //replies with message
        return  interaction.reply(`Left the voice channel - requested by <@${interaction.user.id}>`);
    },
}