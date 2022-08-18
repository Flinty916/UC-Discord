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
        .setName('units')
        .setDescription('Fetches all Community Units.'),
    async execute(interaction) {
        let response = await http.get(`discord/${interaction.guild.id}/units`)
        if(response.status === 200) {
            let units = response.data.units
            let community = response.data.community
            units = units.sort((a, b) => {
                return a.displayOrder - b.displayOrder
            })
            let embeds = []
            for(let unit of units) {
                embeds.push(new MessageEmbed()
                    .setColor(embed_color)
                    .setTitle(`${unit.name}`)
                    .setURL(`https://${community.primaryUrl}/units/${unit.id}`)
                    .setDescription(`${unit.callsign}, Member Count: ${unit.player_count}`)
                    .setThumbnail((unit.image) ? unit.image.path : null)
                    .setTimestamp()
                    .setFooter({ text: `${community.name} (${community.abbreviation})` }))
            }
            for(let embed of embeds) {
                interaction.channel.send({embeds: [embed]})
            }
            interaction.reply({content: "Done! Please Wait...", ephemeral: true})
        } else {
            console.log(error)
            return interaction.reply('Failed to find Unit!')
        }
    },
};