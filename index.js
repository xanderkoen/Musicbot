require('dotenv').config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");

const fs = require('node:fs');
const path = require('node:path');

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]
});

// Load all the commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Initialize the music player
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

// Load default extractors
(async () => {
    try {
        await client.player.extractors.loadDefault();
        console.log('Default extractors loaded successfully.');
    } catch (error) {
        console.error('Failed to load default extractors:', error);
    }
})();

// Event listener for player errors
client.player.on('error', (queue, error) => {
    console.error(`Error in queue "${queue.id}":`, error);
});

// Event listener for when an error occurs during playback
client.player.on('playerError', (queue, track, error) => {
    console.error(`Error playing track "${track.title}" in queue "${queue.id}":`, error);
});

// When the client is ready, run this code
client.once("ready", () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

    for (const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: commands })
            .then(() => console.log(`Successfully registered commands for guild ${guildId}`))
            .catch(console.error);
    }

    client.player.on('debug', console.log);
});

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute({ client, interaction });
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// Log in to Discord
client.login(process.env.BOT_TOKEN);