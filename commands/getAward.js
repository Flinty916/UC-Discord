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
        .setName('award-query')
        .setDescription('Searches for a specific award.')
        .addStringOption(option =>
            option.setRequired(true).setDescription("Award you wish to fetch.").setName("award-query")),
    async execute(interaction) {
        let data = {query: interaction.options.getString('award-query')}
        try {
            let response = await http.post(`discord/${interaction.guild.id}/awards/search`, data)
            let award = response.data.award
            let community = response.data.community
            const embed = new MessageEmbed()
                .setColor(embed_color)
                .setTitle(award.name)
                .setURL(`https://${community.primaryUrl}/awards/${award.id}`)
                .setDescription(award.description)
                .setThumbnail(award.image.path)
                .setTimestamp()
                .setFooter({text: `${community.name} (${community.abbreviation})`})
            interaction.reply({embeds: [embed]})
        } catch (e) {
            return interaction.reply({content:'Failed to find Award!'})
        }
    },
};