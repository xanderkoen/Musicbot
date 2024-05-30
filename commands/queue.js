const { SlashCommandBuilder, MessageEmbed, EmbedBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows playing song and the songs in queue'),
    execute: async ({client, interaction}) => {
        const queue = client.player.queues.get(interaction.guildId)

        //check if there is a active queue
        if (!queue || !queue.isPlaying()) {
            return await interaction.reply("No songs playing.");
        }

        // Get get all the songs in the queue and push it to the array
        let queueString = '';


        //add to
        for (let i = 0; i < queue.tracks.size; i++) {
           queueString += `${i+1} | \`[${queue.tracks.data[i].duration}]\` ${queue.tracks.data[i].title} - <@${queue.tracks.data[i].requestedBy.id}> \n`
        }

        // Get the current song
        const currentSong = queue.currentTrack;

        const embed = new EmbedBuilder()
            .setDescription(`**Currently Playing**\n` +
                (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
                `\n**Queue**\n` + (queueString ? queueString : "-no songs in queue-")
            )
            .setThumbnail(currentSong.thumbnail)

        return interaction.reply({embeds: [embed]});
    }
}