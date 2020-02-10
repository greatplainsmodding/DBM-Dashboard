module.exports = {
    // Used to set the name of the mod. Note this is what will be shown on the dashboard.
    name: "Text Route",

    // Here you can configure what section you want your mod to show up on the dashboard / admin panel.
    section: "Dashboard",

    // true if this is a mod for the dashboard.
    dashboardMod: false,

    // true if this is a mod for the admin panel.
    adminMod: false,

    // true if this is a mod for the admin panel.
    routeMod: true,

    // You can put your name here and this will show up on the dashboard.
    author: "Great Plains Modding",

    // Here you define the version of the mod.
    version: "1.0.0",

    // You can set the mods description here and this will show up on the dashboard.
    short_description: "Returns the bots ping.",

    // If you want to add custom html to the mod set this to true. If not set this to false.
    customHtml: false,

    // Change the width of the popup. 
    size: function () {
        return {
            width: 700
        };
    },

    // Here you can add your custom html! Note if customHtml is set to false this will now show up. This is also valid bootstrap. Also note that this html code will be placed inside of <form> so if you want to retrieve the data all you need to do is add the fields.
    html: function () {
        return ``
    },

    // This is used to move on to the next action. When the code is ran it will return to the dashboard but if you want to redirect you need to set this to false.
    next: true,

    // Whenever the command is executed this is the code that will be ran. You can use req to get stuff, note this only works if you add custom html. 
    run: async (app, config, DBM, dashboardConfig, client) => {
        app.get('/', function (req, res) {
            res.render('homePage', {
                config: config,
                client: DBM.Bot.bot,
                theme: theme()
            });
        });

        app.get('/dashboard/@me', checkAuth, function (req, res) {
            res.render('servers', {
                guilds: req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591),
                user: req.user,
                config: config,
                client: DBM.Bot.bot,
                theme: theme()
            });
        });

        app.get('/dashboard/@me/servers/:guildID', checkAuth, function (req, res) {
            let serv = client.guilds.get(req.params.guildID);
            if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${DBM.Bot.bot.user.id}&scope=bot&permissions=2146958591&guild_id=${req.params.guildID}`);
            let dashboardMods = [];
            app.actions.forEach(data => {
                if (data.dashboardMod == true) {
                    dashboardMods.push(data);
                }
            });
            let actions = app.actions;
            let section = []
            actions.forEach(action => {
                if (!section.includes(action.section) && action.routeMod == false && action.dashboardMod == true) {
                    section.push(action.section)
                }
            });
            if (!DBM.Bot.bot.log) DBM.Bot.bot.log = 'Command Executed';
            res.render('dashboardPanel', {
                client: DBM.Bot.bot,
                server: serv,
                dashboardMods: dashboardMods,
                customHtml: false,
                log: DBM.Bot.bot.log,
                config: config,
                commandExecuted: DBM.actionsExecuted.get(req.user.id).dashboardCommandExecuted,
                theme: theme(),
                sections: section
            });
            dashboardCommandExecuted(req, false);
        });

        app.get('/dashboard/@me/servers/:guildID/:action', checkAuth, function (req, res) {
            let serv = client.guilds.get(req.params.guildID);
            if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${DBM.Bot.bot.user.id}&scope=bot&permissions=2146958591&guild_id=${req.params.guildID}`);
            var action = req.params.action;
            let data = app.actions.get(action);
            let dashboardMods = [];
            app.actions.forEach(data => {
                if (data.dashboardMod == true) dashboardMods.push(data)
            });
            let actions = app.actions;
            let section = []
            actions.forEach(action => {
                if (!section.includes(action.section) && action.routeMod == false && action.dashboardMod == true) {
                    section.push(action.section)
                }
            });
            res.render('dashboardPanel', {
                dashboardMods: dashboardMods,
                commandExecuted: DBM.actionsExecuted.get(req.user.id).dashboardCommandExecuted,
                customHtml: data.customHtml,
                action: data,
                log: DBM.Bot.bot.log,
                client: DBM.Bot.bot,
                config: config,
                server: serv,
                theme: theme(),
                sections: section
            });
            dashboardCommandExecuted(req, false);
        });

        app.get('/dashboard/admin', checkAuthOwner, function (req, res) {
            let config = dashboardConfig();
            let dashboardMods = [];
            app.actions.forEach(data => {
                if (data.adminMod == true) dashboardMods.push(data)
            });
            if (!DBM.Bot.bot.log) DBM.Bot.bot.log = 'Command Executed';
            let actions = app.actions;
            let section = []
            actions.forEach(action => {
                if (!section.includes(action.section) && action.routeMod == false && action.adminMod == true) {
                    section.push(action.section)
                }
            });
            res.render('adminPanel', {
                dashboardMods: dashboardMods,
                commandExecuted: DBM.actionsExecuted.get(req.user.id).adminCommandExecuted,
                customHtml: false,
                log: DBM.Bot.bot.log,
                client: DBM.Bot.bot,
                config: config,
                theme: theme(),
                sections: section
            });
            if (req.user.commandExecuted) DBM.Bot.bot.log = 'Command Executed';
            adminCommandExecuted(req, false);
        });


        app.get('/dashboard/admin/:action', checkAuthOwner, function (req, res) {
            var action = req.params.action;
            let data = app.actions.get(action);
            let dashboardMods = [];
            app.actions.forEach(data => {
                if (data.adminMod == true) dashboardMods.push(data)
            });
            let actions = app.actions;
            let section = []
            actions.forEach(action => {
                if (!section.includes(action.section) && action.routeMod == false && action.adminMod == true) {
                    section.push(action.section)
                }
            });
            res.render('adminPanel', {
                dashboardMods: dashboardMods,
                commandExecuted: false,
                customHtml: true,
                action: data,
                log: DBM.Bot.bot.log,
                client: DBM.Bot.bot,
                config: config,
                theme: theme(),
                sections: section
            });
            adminCommandExecuted(req, false);
        });

        app.post('/api/execute/:action', checkAuthOwner, function (req, res) {
            var next = req.query['next'];
            if (!next) next = false;
            var action = req.params.action;
            let data = app.actions.get(action);

            if (data.customHtml) {
                if (next == 'true') {
                    data.run(DBM.Bot.bot, req, res);
                    if (data.next) {
                        adminCommandExecuted(req, true);
                        res.redirect('/dashboard/admin');
                    };
                } else {
                    res.redirect(`/dashboard/admin/${data.name}`);
                };
            } else {
                data.run(DBM.Bot.bot, req, res);
                if (data.next) {
                    adminCommandExecuted(req, true);
                    res.redirect('/dashboard/admin');
                };
            };
        });

        app.post('/dashboard/@me/servers/:guildID/execute/:action', checkAuth, function (req, res) {
            var next = req.query['next'];
            if (!next) next = false;
            var action = req.params.action;
            let data = app.actions.get(action);
            let serv = client.guilds.get(req.params.guildID);

            if (data.customHtml) {
                if (next == 'true') {
                    data.run(DBM.Bot.bot, req, res, serv);
                    if (data.next) {
                        dashboardCommandExecuted(req, true);
                        res.redirect(`/dashboard/@me/servers/${serv.id}`);
                    };
                } else {
                    res.redirect(`/dashboard/@me/servers/${serv.id}/${data.name}`);
                };
            } else {
                data.run(DBM.Bot.bot, req, res, serv);
                if (data.next) {
                    dashboardCommandExecuted(req, true);
                    res.redirect(`/dashboard/@me/servers/${serv.id}/${data.name}`);
                };
            };
        });

        app.post('/api/admin/web', checkAuthOwner, function (req, res) {
            const dashboardConfigPath = require("path").join(__dirname, "../extensions", "dbm_dashboard_extension", "config.json");
            let config = dashboardConfig();

            config.featureOne.name = req.body.featureOneName;
            config.featureOne.description = req.body.featureOneDescription;
            config.featureTwo.name = req.body.featureTwoName;
            config.featureTwo.description = req.body.featureTwoDescription;
            config.featureThree.name = req.body.featureThreeName;
            config.featureThree.description = req.body.featureThreeDescription;
            config.featureFour.name = req.body.featureFourName;
            config.featureFour.description = req.body.featureFourDescription;
            config.footerText = req.body.footerText;
            config.introText = req.body.introText;

            let settings = JSON.stringify(config);
            require("fs").writeFileSync(dashboardConfigPath, settings, "utf8");
            res.redirect('/')
        })

        function checkAuth(req, res, next) {
            if (req.isAuthenticated()) {
                return next()
            }
            res.redirect('/login');
        }

        function checkAuthOwner(req, res, next) {
            if (req.isAuthenticated()) {
                if (req.user.id == config.owner) {
                    next();
                } else res.redirect('/dashboard/@me');
            } else res.redirect('/login');
        }

        function adminCommandExecuted(req, commandExecuted) {
            let data = { adminCommandExecuted: commandExecuted }
            DBM.actionsExecuted.set(req.user.id, data);
        };

        function dashboardCommandExecuted(req, dashboardCommandExecuted) {
            let data = { dashboardCommandExecuted: dashboardCommandExecuted }
            DBM.actionsExecuted.set(req.user.id, data);
        };

        function theme() {
            let theme = app.themes.get(config.theme);
            return theme
        }
    }
}