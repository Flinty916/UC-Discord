const {SlashCommandBuilder} = require('@discordjs/builders')
const {EmbedBuilder} = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js')
const functions = require('../functions')
const {baseUrl, uc_token, embed_color} = require('../config.json');
const axios = require('axios')
const http = axios.create({
    baseURL: baseUrl,
    headers: {
        'UC-AUTH': uc_token
    }
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unit-query')
        .setDescription('Searches for a specific unit.')
        .addStringOption(option =>
            option.setRequired(true).setDescription("Unit you wish to fetch.").setName("unit-query")),
    async execute(interaction) {
        let data = {query: interaction.options.getString('unit-query')}
        try {
            let response = await http.post(`discord/${interaction.guild.id}/units/search`, data)
            let unit = response.data.unit
            let community = response.data.community
            const embed = new MessageEmbed()
                .setColor(embed_color)
                .setTitle(unit.name)
                .setURL(`https://${community.primaryUrl}/units/${unit.id}`)
                .setDescription(`${unit.callsign}, Member Count: ${unit.player_count}`)
                .setThumbnail(unit.image.path)
                .setTimestamp()
                .setFooter({text: `${community.name} (${community.abbreviation})`})
            interaction.reply({embeds: [embed]})
        } catch (e) {
            return interaction.reply({content:'Failed to find Unit!'})
        }
    },
};