const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
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
        .setName('profile-query')
        .setDescription('Search for a profile by name.')
        .addStringOption(option =>
            option.setRequired(true).setDescription("Profile you wish to search for.").setName("player-query")),
    async execute(interaction) {
        let data = {query: interaction.options.getString('player-query')}
        let response = await http.post(`discord/${interaction.guild.id}/profile/search`, data)
        if(response.status === 200) {
            let profile = response.data.profile
            console.log(functions.rankOrAvatar(profile))
            let community = response.data.community
            const embed = new MessageEmbed()
                .setColor(embed_color)
                .setTitle(functions.nameFormat(profile))
                .setURL(`https://${community.primaryUrl}`)
                .setDescription((profile.rank) ? profile.rank.name : "Unranked")
                .setThumbnail(functions.rankOrAvatar(profile))
                .setFields(
                    { name: `Awards (${profile.awards.length})`, value: functions.arrayToList(profile.awards), inline: true },
                    { name: `Qualifications (${profile.qualifications.length})`, value: functions.arrayToList(profile.qualifications), inline: true },
                    { name: `Units (${profile.units.length})`, value: functions.arrayToList(profile.units), inline: true },
                    { name: `Positions (${profile.positions.length})`, value: functions.arrayToList(profile.positions), inline: true },
                )
                .setTimestamp()
                .setFooter({ text: `${community.name} (${community.abbreviation})` });
            interaction.reply({embeds: [embed]})
        } else {
            console.log(error)
            return interaction.reply('Failed to find Player Profile!')
        }
    },
};