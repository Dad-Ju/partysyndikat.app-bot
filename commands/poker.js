const { default: axios } = require("axios")

module.exports = {
    name: "poker",
    desc: "Creates a Invite for the Poker Game",
    slash: {
        guild: "527608126216732694",
        options: []
    }, // Or just False to get a native Command lol
    /**
     * CodeFunction that will Run....
     * @typedef InteractionResponse
     * @type {Object}
     * @property {import("discord.js").Channel} channel - The Channel where the Command is send in   
     * @property {import("discord.js").Guild} guild - The Guild of the Command
     * @property {import("discord.js").GuildMember} member - The Member who triggert it
     * @property {Record<String, any>} options - The Options of the command
     * @property {string} name - The Command Name!
     * 
     * Params that will be Provided
     * @param {InteractionResponse} interaction - The Interaction data that was send with
     * @param {import("discord.js").Client} Client - The Discord JS Client
     */
    code: async (interaction, Client) => {
        const targetchannel = interaction.member.voice.channelID
        if(!targetchannel) return interaction.channel.send("Bro, du musst in einem Voicechannel sein....\nKekW")

        const { data } = await axios.post(`https://discord.com/api/v8/channels/${targetchannel}/invites`, 
            {
                "max_age": 60,
                "max_uses": 1,
                "target_type": 2,
                "target_application_id": "755827207812677713"
            }, 
            {
                headers: {
                    'Authorization': `Bot ${Client.token}`,
                    'Content-Type': "application/json"}
            })
        
        if(!data) return interaction.channel.send("Yeet...\n Versuch nochmal!")
    
        interaction.channel.send(`Poker: <https://discord.gg/${data.code}>`)
    }
}