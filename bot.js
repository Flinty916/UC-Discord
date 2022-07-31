const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios')
const { Client, Intents, Collection } = require('discord.js');
const { bot_token, baseUrl, uc_token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const http = axios.create({
    baseURL: baseUrl,
    headers: {
        'UC-AUTH': uc_token
    }
})

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if(interaction.isButton()) {
        let data = {
            custom_id: interaction.customId,
            member: {
                user: {
                    id: interaction.member.user.id
                }
            }
        }
        http.post("/discord/interactions", {payload: data}).then(() => {
            interaction.deferUpdate()
        })
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(bot_token);