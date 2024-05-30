//leave voice call
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Kick the bot from the channel."),
    execute: async ({ client, interaction }) => {

        // Get the current queue
        const queue = client.player.queues.get(interaction.guildId)

        if (!queue)
        {
            await interaction.reply("There are no songs in the queue")
            return;
        }

        // Deletes all the songs from the queue and exits the channel
        queue.delete()

        console.log(interaction.user.id)

        await interaction.reply(`Left the voice channel - requested by <@${interaction.user.id}>`);
    },
}