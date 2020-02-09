module.exports = {
    // Used to set the name of the mod. Note this is what will be shown on the dashboard.
    name: "Global Prefix",

    // Here you can configure what section you want your mod to show up on the dashboard / admin panel.
    section: "Dashboard",

    // You can put your name here and this will show up on the dashboard.
    author: "Great Plains Modding",

    // Here you define the version of the mod.
    version: "1.0.0",

    // true if this is a mod for the dashboard.
    dashboardMod: false,

    // true if this is a mod for the admin panel.
    adminMod: true,

    // this is used for custom routes / custom pages. Set this to true if this is a mod for routes.
    routeMod: false,

    // You can set the mods description here and this will show up on the dashboard.
    short_description: "Run whatever JS code you want.",

    // If you want to add custom html to the mod set this to true. If not set this to false.
    customHtml: true,

    // Change the width of the popup. 
    size: function () {
        return {
            width: 700
        };
    },

    // Here you can add your custom html! Note if customHtml is set to false this will now show up. This is also valid bootstrap. Also note that this html code will be placed inside of <form> so if you want to retrieve the data all you need to do is add the fields.
    html: function () {
        const config = require('../../../../data/settings.json');
        return `
        <div class="form-group">
            <p>The global prefix is currently set to <b><code>${config.tag}</code></b></p>
            <input class="form-control" name="prefix" rows="4" value="${config.tag}" required>
        </div>
        `
    },


    // This is used to move on to the next action. When the code is ran it will return to the dashboard but if you want to redirect you need to set this to false.
    next: true,

    // Whenever the command is executed this is the code that will be ran. You can use req to get stuff, note this only works if you add custom html. 
    run: async (client, req) => {
        const fs = require('fs');
        const path = require('path');
        let config = require('../../../data/settings.json');
        config.tag = req.body.prefix;

        const configPath = path.join(process.cwd(), "data", "settings.json");
        let settings = JSON.stringify(config)
        fs.writeFileSync(configPath, settings);
        client.log = `Successfully updated ${client.user.username}'s prefix. Note you will need to restart the bot for these changes to take effect.`
    }
}