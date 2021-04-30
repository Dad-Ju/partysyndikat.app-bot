module.exports = {
    name: "Deafult Event",
    desc: "Some Description",
    trigger: "",
    /**
     * CodeFunction that will Run.... 
     * Params that will be Provided
     * @param {import("discord.js").Message} msg - The message of the Event
     * @param {import("discord.js").Client} Client - The Discord JS Client
     */
    run: async (msg, Client) => {
        console.log(msg.id)
        console.log(Client.user.tag)
    }
}