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
        .setName('awards')
        .setDescription('Fetches all Community Awards.'),
    async execute(interaction) {
        let response = await http.get(`discord/${interaction.guild.id}/awards`)
        if(response.status === 200) {
            let awards = response.data.awards
            let community = response.data.community
            awards = awards.sort((a, b) => {
                return a.displayOrder - b.displayOrder
            })
            let embeds = []
            for(let award of awards) {
                embeds.push(new MessageEmbed()
                    .setColor(embed_color)
                    .setTitle(award.name)
                    .setURL(`https://${community.primaryUrl}/awards/${award.id}`)
                    .setDescription(award.description)
                    .setThumbnail(award.image.path)
                    .setTimestamp()
                    .setFooter({ text: `${community.name} (${community.abbreviation})` }))
            }
            for(let embed of embeds) {
                interaction.channel.send({embeds: [embed]})
            }
            interaction.reply({content: "Done! Please Wait...", ephemeral: true})
        } else {
            console.log(error)
            return interaction.reply('Failed to fetch Awards!')
        }
    },
};