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
        .setName('qualification-query')
        .setDescription('Searches for a specific qualification.')
        .addStringOption(option =>
            option.setRequired(true).setDescription("Qualification you wish to fetch.").setName("qualification-query")),
    async execute(interaction) {
        let data = {query: interaction.options.getString('qualification-query')}
        try {
            let response = await http.post(`discord/${interaction.guild.id}/qualifications/search`, data)
            let qualification = response.data.qualification
            let community = response.data.community
            const embed = new MessageEmbed()
                .setColor(embed_color)
                .setTitle(qualification.name)
                .setURL(`https://${community.primaryUrl}/qualifications/${qualification.id}`)
                .setDescription(qualification.description)
                .setThumbnail(qualification.image.path)
                .setTimestamp()
                .setFooter({text: `${community.name} (${community.abbreviation})`})
            interaction.reply({embeds: [embed]})
        } catch (e) {
            return interaction.reply({content:'Failed to find Qualification!'})
        }
    },
};