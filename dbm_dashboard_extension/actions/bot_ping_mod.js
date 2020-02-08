module.exports = {
    // Used to set the name of the mod. Note this is what will be shown on the dashboard.
    name: "Bot Ping",

    // This does nothing currently but in the future I plan on sorting stuff by sections. 
    section: "Test",

    // You can put your name here and this will show up on the dashboard.
    author: "Great Plains Modding",

    // Here you define the version of the mod.
    version: "1.0.0",

    // You can set the mods description here and this will show up on the dashboard.
    short_description: "Returns the bots ping.",

    // If you want to add custom html to the mod set this to true. If not set this to false.
    customHtml: false,

    // Here you can add your custom html! Note if customHtml is set to false this will now show up. This is also valid bootstrap. Also note that this html code will be placed inside of <form> so if you want to retrieve the data all you need to do is add the fields.
    html: function () {
        return ``
    },

    // This is used to move on to the next action. When the code is ran it will return to the dashboard but if you want to redirect you need to set this to false.
    next: true,

    // Whenever the command is executed this is the code that will be ran. You can use req to get stuff, note this only works if you add custom html. 
    run: async (client, req, res) => {
        client.log = `Bot Ping: ${client.ping.toFixed(2)}`
    }
}