module.exports = {
    name: "",
    desc: "",
    slash: {
        // guild: "",
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

    }
}