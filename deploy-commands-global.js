const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/rest');
const { client_id, bot_token } = require('./config.json');

console.log(client_id)

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

console.log(commands)

const rest = new REST({ version: '10' }).setToken(bot_token);

rest.put(Routes.applicationCommands(client_id), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);