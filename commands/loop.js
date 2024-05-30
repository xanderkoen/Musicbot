//toggle loop for current song playing
//loop song | loop queue | no loop
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, EmbedBuilder} = require("discord.js")
const {QueueRepeatMode} = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Select loop mode for music")
        .addSubcommand(subcommand =>
            subcommand
                .setName('current')
                .setDescription('loops the current song playing'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('queue')
                .setDescription('loops trough all the songs currently in the queue'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('disables looping'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('auto')
                .setDescription('automatically ads similar music.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('mode')
                .setDescription('shows the current play mode')),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guildId)

        //check if bot is in channel
        if (!queue){
            return await interaction.reply("I'm not in a voice channel");
        }

        //check if bot is playing
        if (!queue.tracks){
            return await interaction.reply("I'm not currently playing anything");
        }





        if (interaction.options.getSubcommand() === "current") {

            //check if player is already looping
            if (queue.repeatMode === 1){
                return await interaction.reply("already looping the song");
            }
            //loop current song playing
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            return await interaction.reply(`looping current track - ${queue.currentTrack.title}`);

        }else if (interaction.options.getSubcommand() === "queue") {
            //check if player is already looping
            if (queue.repeatMode === 2){
                return await interaction.reply("already looping the queue");
            }

            //loop all songs in queue
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            return await interaction.reply("looping all songs in queue");

        }else if (interaction.options.getSubcommand() === "auto") {
            //check if player is already looping
            if (queue.repeatMode === 3){
                return await interaction.reply("looping all songs in queue");
            }

            //disable looping
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            return await interaction.reply("Autoplay enabled");

        } else if (interaction.options.getSubcommand() === "disable") {
            //disable looping
            queue.setRepeatMode(QueueRepeatMode.OFF);


            return await interaction.reply("disabled looping");
        } else if (interaction.options.getSubcommand() === "mode") {
            let repeatModeMessage;
            switch(queue.repeatMode) {
                case 0:
                    repeatModeMessage = 'not looping anything';
                    break;
                case 1:
                    repeatModeMessage = 'looping the current song';
                    break;
                case 2:
                    repeatModeMessage = 'looping the queue';
                    break;
                case 3:
                    repeatModeMessage = 'adding my own songs with autoplay';
                    break;
                default:
                    repeatModeMessage = 'in an unknown state';
            }
            return interaction.reply(`i am currently ${repeatModeMessage}`)
        }
    }
}
