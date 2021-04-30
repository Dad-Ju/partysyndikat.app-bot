require("dotenv").config();
const fs = require('fs');
const Discord = require("discord.js");
const random = require("random");
const Slash = require('./extra/slashcommands');
const config = require('./config.json');

const Client = new Discord.Client({
    partials: ["CHANNEL", "REACTION", "MESSAGE"],
    retryLimit: 5,
    presence: {
        activity: {name: "about my shitty Files", type: "WATCHING"},
        afk: true,
        status: "dnd"
    }
})

Client.once("ready",async () => {
    console.log(`Ready as ${Client.user.tag}, ${new Date().toISOString()}`)

    const setPressence = async () => {
        let activity;
        activity = config.pressence[random.int(0, config.pressence.length)]

        Client.user.setPresence({
            activity,
            status: "online"
        }).catch(console.errors)
    }
    
    setPressence();
    
    Client.setInterval(setPressence, 60*60000)
})

// Client.on("message", msg => {
//     console.log(msg);
// })

// make init
;(() => {
    ["commands", "events"].forEach(initType => {
        console.log(`Start Init of '${initType}'`);
        if(initType === "commands") Slash.loadCommands()
        fs.readdirSync(`./${initType}`).filter(name => name.endsWith(".js") && !name.endsWith("default.js")).forEach(async (fileName, index, all) => {
            const module = require(`./${initType}/${fileName}`)
            if(initType === "events"){
                if(!module.trigger || module.trigger == "") return
                if(!Client.Events) Client.Events = {}
                if(!Client.Events[module.trigger]) {
                    console.log(`Register D.js-Event: '${module.trigger}'`)
                    Client.Events[module.trigger] = []
                    Client.on(module.trigger, (...args) => {
                        Client.Events[module.trigger].forEach(evt => {
                            try {
                                evt.run(...args, Client)
                            } catch (error) {
                                console.log(`Problem mit dem Event '${evt.name}'!\nError:`, error);
                            }
                        })
                    })
                }
                Client.Events[module.trigger].push(module);
            } else {
                if(module.slash) await Slash.enableCommand(module.name, module.desc, module.slash)
                if(!Client[module.slash ? "SlashCommands" : "Commands" ]) Client[module.slash ? "SlashCommands" : "Commands" ] = {}
                Client[module.slash ? "SlashCommands" : "Commands" ][module.name] = module
            }
            console.log(`Loaded ${module.slash ? "slashcommand" : initType.slice(0, -1)} '${module.name}'! (${index +1}/${all.length})`)
        })
        if(initType === "commands") Slash.removeUnloaded(Client.SlashCommands)
    })
    Slash.init(Client)
})()

Client.login(process.env.token);