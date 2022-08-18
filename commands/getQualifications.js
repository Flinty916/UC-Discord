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
        .setName('qualifications')
        .setDescription('Fetches all Community Qualifications.'),
    async execute(interaction) {
        let response = await http.get(`discord/${interaction.guild.id}/qualifications`)
        if(response.status === 200) {
            let qualifications = response.data.qualifications
            let community = response.data.community
            qualifications = qualifications.sort((a, b) => {
                return a.displayOrder - b.displayOrder
            })
            let embeds = []
            for(let qualification of qualifications) {
                embeds.push(new MessageEmbed()
                    .setColor(embed_color)
                    .setTitle(qualification.name)
                    .setURL(`https://${community.primaryUrl}/qualifications/${qualification.id}`)
                    .setDescription(qualification.description)
                    .setThumbnail(qualification.image.path)
                    .setTimestamp()
                    .setFooter({ text: `${community.name} (${community.abbreviation})` }))
            }
            for(let embed of embeds) {
                interaction.channel.send({embeds: [embed]})
            }
            interaction.reply({content: "Done! Please Wait...", ephemeral: true})
        } else {
            console.log(error)
            return interaction.reply('Failed to find Qualification!')
        }
    },
};