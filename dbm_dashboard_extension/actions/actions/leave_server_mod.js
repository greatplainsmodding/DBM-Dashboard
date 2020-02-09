module.exports = {
    // Used to set the name of the mod. Note this is what will be shown on the dashboard.
    name: "Leave Guild",

    // Here you can configure what section you want your mod to show up on the dashboard / admin panel.
    section: "Dashboard",

    // true if this is a mod for the dashboard.
    dashboardMod: false,

    // true if this is a mod for the admin panel.
    adminMod: true,

    // this is used for custom routes / custom pages. Set this to true if this is a mod for routes.
    routeMod: false,

    // You can put your name here and this will show up on the dashboard.
    author: "Great Plains Modding",

    // Here you define the version of the mod.
    version: "1.0.0", 

    // You can set the mods description here and this will show up on the dashboard.
    short_description: "Leaves a specified server.",

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
        return `
        <div class="form-group">
            <p>Find By:</p>
            <select class="form-control" name="type">
                <option selected value="id">Guild ID</option>
                <option value="name">Guild Name</option>
            </select><br>
            <p>Guild ID / Name:</p>
            <input class="form-control" name="server" rows="4" required>
        </div>
        `
    },

    // This is used to move on to the next action. When the code is ran it will return to the dashboard but if you want to redirect you need to set this to false.
    next: true,

    // Whenever the command is executed this is the code that will be ran. You can use req to get stuff, note this only works if you add custom html. 
    run: async (client, req) => {
        let server = undefined;
        if (req.body.type == 'id') server = client.guilds.find(server => server.id === req.body.server);
        if (!server) server = client.guilds.find(server => server.name === req.body.server);

        if (!server) return client.log = 'I couldn\'t find this server, please make sure you have the right ID or name.';

        server.leave();
        let serverFound = server
        client.log = `Successfully left ${serverFound.name} (${serverFound.id})`
        
    }
}