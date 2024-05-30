//remove song from queue
require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue')
        .addIntegerOption((option) =>
            option.setName('songid').setDescription('id of the track you want to remove').setMinValue(1).setRequired(true)
        ),
    execute: async ({client, interaction}) => {
        const queue = client.player.queues.get(interaction.guildId)

        let removeid = interaction.options.getInteger('songid')

        //get remove specific track
        const remove = queue?.tracks.at(removeid);

        queue.node.remove(remove)

        return interaction.reply({content :`Successfully removed song`});
    }
}