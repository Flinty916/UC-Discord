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
        .setName('rank-query')
        .setDescription('Searches for a specific rank.')
        .addStringOption(option =>
            option.setRequired(true).setDescription("Rank you wish to fetch.").setName("rank-query")),
    async execute(interaction) {
        let data = {query: interaction.options.getString('rank-query')}
        try {
            let response = await http.post(`discord/${interaction.guild.id}/ranks/search`, data)
            let rank = response.data.rank
            let community = response.data.community
            const embed = new MessageEmbed()
                .setColor(embed_color)
                .setTitle(rank.name)
                .setURL(`https://${community.primaryUrl}/ranks/${rank.id}`)
                .setDescription(rank.description)
                .setThumbnail(rank.image.path)
                .setTimestamp()
                .setFooter({text: `${community.name} (${community.abbreviation})`})
            interaction.reply({embeds: [embed]})
        } catch (e) {
            return interaction.reply({content:'Failed to find Rank!'})
        }
    },
};