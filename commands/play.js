// play/queue song
const { SlashCommandBuilder } = require('discord.js');
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Queue a song')
        .addSubcommand( subcommand => {
            subcommand
                .setName("search")
                .setDescription("Play song from title")
                .addStringOption(option => {
                    option
                        .setName("search")
                        .setRequired(true)
                })
        }),
    execute: async ({client, interaction}) => {
        if (!interaction.member.voice.channel)
        {
            await interaction.reply("You must be in a voice channel to use this command");
            return;
        }

        const queue = await client.player.queue.create(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed();
        if (interaction.options.getSubcommand() === "search")
        {
            let url = interaction.options.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            });

            if (result.tracks.length === 0)
            {
                await interaction.reply("no results found");
                return;
            }

            const song = result.tracks[0]
            await queue.addTrack(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration : ${song.duration}`});

        }
    }
}