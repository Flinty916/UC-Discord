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
            let ranks = response.data.ranks
            let community = response.data.community
            ranks = ranks.sort((a, b) => {
                return a.displayOrder - b.displayOrder
            })
            let embeds = []
            for(let rank of ranks) {
                embeds.push(new MessageEmbed()
                    .setColor(embed_color)
                    .setTitle(rank.name)
                    .setURL(`https://${community.primaryUrl}/ranks/${rank.id}`)
                    .setDescription(rank.description)
                    .setThumbnail(rank.image.path)
                    .setTimestamp()
                    .setFooter({ text: `${community.name} (${community.abbreviation})` }))
            }
            for(let embed of embeds) {
                interaction.channel.send({embeds: [embed]})
            }
            interaction.reply({content: "Done! Please Wait...", ephemeral: true})
        } else {
            console.log(error)
            return interaction.reply('Failed to fetch Ranks!')
        }
    },
};