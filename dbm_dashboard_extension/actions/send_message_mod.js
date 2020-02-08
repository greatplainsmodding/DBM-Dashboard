module.exports = {
    // Used to set the name of the mod. Note this is what will be shown on the dashboard.
    name: "Send Message",

    // This does nothing currently but in the future I plan on sorting stuff by sections. 
    section: "Test",

    // You can put your name here and this will show up on the dashboard.
    author: "Great Plains Modding",

    // Here you define the version of the mod.
    version: "1.0.0", 

    // You can set the mods description here and this will show up on the dashboard.
    short_description: "Sends a message to the specified server and channel.",

    // If you want to add custom html to the mod set this to true. If not set this to false.
    customHtml: true,

    // Here you can add your custom html! Note if customHtml is set to false this will now show up. This is also valid bootstrap. Also note that this html code will be placed inside of <form> so if you want to retrieve the data all you need to do is add the fields.
    html: function () {
        return `
        <div class="form-group">
            <p>Find Server By:</p>
            <select class="form-control" name="serverType">
                <option selected value="id">Guild ID</option>
                <option value="name">Guild Name</option>
            </select><br>
            <p>Guild ID / Name:</p>
            <input class="form-control" name="server" rows="4" required><br><br>

            <p>Find Channel By:</p>
            <select class="form-control" name="channelType">
                <option selected value="id">Channel ID</option>
                <option value="name">Channel Name</option>
            </select><br>
            <p>Channel ID / Name:</p>
            <input class="form-control" name="channel" rows="4" required><br><br>

            <p>Message:</p>
            <textarea class="form-control" name="message" rows="4" required style="width=100%"></textarea>
        </div>
        `
    },

    // This is used to move on to the next action. When the code is ran it will return to the dashboard but if you want to redirect you need to set this to false.
    next: true,

    // Whenever the command is executed this is the code that will be ran. You can use req to get stuff, note this only works if you add custom html. 
    run: async (client, req) => {
        console.log(req.body)
        let server = undefined;
        let channel = undefined;
        if (req.body.serverType == 'id') server = client.guilds.find(server => server.id === req.body.server);
        if (!server) server = client.guilds.find(server => server.name === req.body.server);
        if (!server) return client.log = 'I couldn\'t find this server, please make sure you have the right ID or name.';

        if (req.body.channelType == 'id') channel = server.channels.find(channel => channel.id === req.body.channel);
        if (!channel) channel = client.guilds.find(channel => channel.name === req.body.channel);
        if (!channel) return client.log = 'I couldn\'t find this channel, please make sure you have the right ID or name.';

        
        channel.send(req.body.message);
        client.log = `Successfully sent the message to ${server.name}`;
        
    }
}