// play/queue song
const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType, Track} = require("discord-player")
const ytdl = require("ytdl-core");
const { search } = require("yt-search")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("search a name or link from youtube.")
        .addStringOption(option =>
            option.setName("search")
                .setDescription("search name or link")
                .setRequired(true)
        ),
    execute: async ({client, interaction}) => {
        // Make sure the user is inside a voice channel
        if (!interaction.member.voice.channel) return interaction.reply("You need to be in a Voice Channel to play a song.");

        // Create a play queue for the server
        const queue = await client.player.queues.create(interaction.guild);

        // Wait until you are connected to the channel
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

            // Search for the song using the discord-player
            let url = interaction.options.getString("search")
            let result;

            //check if message is link or not
            if (url.startsWith('https://') && ytdl.validateURL(url)) // check if answer is url
            {
                console.log(`playing (url) : ${interaction.options.getString("search")}`);

                // Search for the song using the discord-player
                result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })

                //return if no tracks are found
                if (result.tracks.length === 0) {
                    console.log(`No results found for query: "${url}"`);
                    return interaction.reply({content: 'No results found for ' + url, ephemeral: true});
                }else{
                    console.log("vid found!")
                }
            }
            else {
                console.log(`playing (search) : ${interaction.options.getString("search")}`);

                // Search for the song using the discord-player
                result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_SEARCH
                })

                if (result.tracks.length === 0) {
                    console.log(`No results found for query: "${url}"`);
                    return interaction.reply({content: 'No results found for ' + url, ephemeral: true});
                } else {
                    console.log("vid found!");
                }
            }

                //add the track to the queue
                const song = result.tracks[0]

                //build embed response
                const embed = new EmbedBuilder()
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({text: `Duration: ${song.duration}`})

                // Play the song
                if (!queue.playing) {
                    queue.play(song)
                }

                // Send the embed with information about the player
                return interaction.reply({embeds: [embed]});


    }
}