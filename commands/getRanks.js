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
        .setName('ranks')
        .setDescription('Fetches all Community Ranks.'),
    async execute(interaction) {
        let response = await http.get(`discord/${interaction.guild.id}/ranks`)
        if(response.status === 200) {
            let ranks = response.data.profile
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