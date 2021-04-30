const {default: axios} = require('axios');

let commands = {global: []}

const SlashDiscord = axios.create({
    baseURL: `https://discord.com/api/v8/applications/${process.env.appID}`,
    headers: {
        "Authorization": `Bot ${process.env.token}`
    }
})

/**
 * Init the SlashCommands Websocket stuff.
 * @param {import("discord.js").Client} Client 
 */
const init = (Client) => {
    Client.on("raw", async packet => {
        if(!["INTERACTION_CREATE"].includes(packet.t)) return
        repsondSlash(packet.d.id, packet.d.token).catch(error => console.log(JSON.stringify(error.response.data, null ,2)))
        const guild = await Client.guilds.fetch(packet.d.guild_id).catch(() => {return null})
        const command = {
            channel: await Client.channels.fetch(packet.d.channel_id).catch(() => {return null}),
            guild: guild,
            member: await guild.members.fetch(packet.d.member.user.id).catch(() => {return null}),
            options: typeof packet.d.data.options !== 'undefined' ? packet.d.data.options.reduce((acc, option) => ({...acc, [option.name]: option.value}), {}) : {},
            name: packet.d.data.name,
        }

        try {
            Client.SlashCommands[command.name].code(command, Client)
        } catch (error) {
            console.log(`Problem mit dem SlashCommand '${command.name}'!\nError:`, error);
        }
    })
    console.log("Slashcommand Event Loaded!")
}

const loadCommands = async (guildID) => {
    // TODO! make "caching" work lol
    // if(commands[guildID ? guildID : "global"] && commands[guildID ? guildID : "global"].length > 0) return
    let request = guildID ? `/guilds/${guildID}/commands` : "/commands"
    console.log("🚀 ~ file: slashcommands.js ~ line 41 ~ loadCommands ~ request", request)
    const stuff = await SlashDiscord.get(request).catch(() => console.log(`Could not Fetch Guild SlashCommands for guild with ID: '${guildID}'`)).catch(console.error)
    
    if(!stuff || stuff.status !== 200) return

    guildID ? commands[guildID] = stuff.data.filter(command => commands.global.some(globalcommand => globalcommand.name === command.name)) : commands.global = stuff.data
}

/**
 * @typedef slashConfig
 * @type {object}
 * @property {string} guild - The Guild the Command belongs to
 * @property {Array<string, any>} options - The Options for the command
 * @param {string} commandName - The Command Name
 * @param {string} commandDesc - The Command Description
 * @param {slashConfig} slashConfig
 */
const enableCommand = async (commandName, commandDesc, slashConfig) => {
    await loadCommands(slashConfig.guild).catch(console.log)
    console.log(commands)
    const scope = commands[slashConfig.guild ? slashConfig.guild : "global"]
    // TODO! Update this is kinda Broke (It always updates)
    if(scope && scope[commandName.toLowerCase()] && scope[commandName.toLowerCase()].description == commandDesc && scope[commandName.toLowerCase()].options === slashConfig.options) return

    // TODO TBD if I can just use add to Override instead of editing it
    // if(scope[commandName.toLowerCase()]) return editCommand()

    console.log("Adding or Updating Slaschcommand!")

    const {data} = await SlashDiscord.post(`${slashConfig.guild ? "guilds/" + slashConfig.guild : ""}/commands`, JSON.stringify({
        name: commandName.toLowerCase(), 
        description: commandDesc,
        options: slashConfig.options,
    }), {headers: {'Content-Type': 'application/json'}}).catch(console.error)

    if(!commands[slashConfig.guild ? slashConfig.guild : "global"]) commands[slashConfig.guild ? slashConfig.guild : "global"] = {}
    commands[slashConfig.guild ? slashConfig.guild : "global"][commandName.toLowerCase()] = data
}

const removeUnloaded = async (Client) => {
    // TODO! Yea you know what to do
    // Client.SlashCommands
}

const repsondSlash = async (id, token) => {
    const data = await axios.post(`https://discord.com/api/v8/interactions/${id}/${token}/callback`, JSON.stringify({
        "type": 4, 
        data: {
            content: "Yee"
        }
    }), {headers: {Authorization: `Bot ${process.env.token}`, "Content-Type": "application/json"}})
    if(data.status === 204){
        setTimeout(() => {
            axios.delete(`https://discord.com/api/v8/webhooks/${process.env.appID}/${token}/messages/@original`)
        }, 1*20);
    }
    
    return data
}

// Get at least global Commands
loadCommands();
module.exports = {
    commands,
    init,
    loadCommands,
    enableCommand,
    removeUnloaded,
}