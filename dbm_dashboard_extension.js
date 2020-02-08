module.exports = {

	//---------------------------------------------------------------------
	// Editor Extension Name
	//
	// This is the name of the editor extension displayed in the editor.
	//---------------------------------------------------------------------

	name: "DBM Dashboard",

	//---------------------------------------------------------------------
	// Is Command Extension
	//
	// Must be true to appear in "command" context menu.
	// This means each "command" will hold its own copy of this data.
	//---------------------------------------------------------------------

	isCommandExtension: false,

	//---------------------------------------------------------------------
	// Is Event Extension
	//
	// Must be true to appear in "event" context menu.
	// This means each "event" will hold its own copy of this data.
	//---------------------------------------------------------------------

	isEventExtension: false,

	//---------------------------------------------------------------------
	// Is Editor Extension
	//
	// Must be true to appear in the main editor context menu.
	// This means there will only be one copy of this data per project.
	//---------------------------------------------------------------------

	isEditorExtension: true,

	//---------------------------------------------------------------------
	// Extension Fields
	//
	// These are the fields for the extension. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the command's/event's JSON data.
	//---------------------------------------------------------------------

	fields: [],

	//---------------------------------------------------------------------
	// Default Fields
	//
	// The default values of the fields.
	//---------------------------------------------------------------------

	defaultFields: {},

	//---------------------------------------------------------------------
	// Extension Dialog Size
	//
	// Returns the size of the extension dialog.
	//---------------------------------------------------------------------

	size: function () {
		return {
			width: 700,
			height: 540
		};
	},

	//---------------------------------------------------------------------
	// Extension HTML
	//
	// This function returns a string containing the HTML used for
	// the context menu dialog.
	//---------------------------------------------------------------------

	html: function (data, DBM) {
		const dashboardConfig = require('../extensions/dbm_dashboard_extension/config.json');
		return `
		<div style="overflow-y: scroll; overflow-x: hidden; width: 100%">
			<div style="padding-left: 15px; padding-top: 3px; width: 100%">
				<div>
					<p>
						<u><b>Extension Info:</b></u><br>
						<b>Version:</b> 1.0.0<br>
						<b>Created by:</b> Great Plains Modding<br><br>
					</p>
				</div>
				<div style="float: left; width: 99%;">
					Port:<br>
					<input type="text" value="${dashboardConfig.port}" class="round" style="padding-bottom: 3px;" id="port"><br>
					clientSecret:<br>
					<input type="text" value="${dashboardConfig.clientSecret}" class="round" id="clientSecret"><br>
					callbackURL:<br>
					<input type="text" value="${dashboardConfig.callbackURL}" class="round" id="callbackURL"><br>
					Owner ID:<br>
					<input type="text" value="${dashboardConfig.owner}" class="round" id="owner"><br>
					supportServer:<br>
					<input type="text" value="${dashboardConfig.supportServer}" class="round" id="supportServer"><br>
				</div>
			</div>
		</div>`
	},

	//---------------------------------------------------------------------
	// Extension Dialog Init Code
	//
	// When the HTML is first applied to the extension dialog, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {

	},

	//---------------------------------------------------------------------
	// Extension Dialog Close Code
	//
	// When the dialog is closed, this is called. Use it to save the data.
	//---------------------------------------------------------------------

	close: function (document, data) {
		try {
			const port = String(document.getElementById("port").value);
			const clientSecret = String(document.getElementById("clientSecret").value);
			const callbackURL = String(document.getElementById("callbackURL").value);
			const owner = String(document.getElementById("owner").value);
			const supportServer = String(document.getElementById("supportServer").value);

			const config = require('./dbm_dashboard_extension/config.json');
			const dashboardConfigPath = require("path").join(__dirname, "../extensions", "dbm_dashboard_extension", "config.json");
			const configNew = {
				port: port,
				isBotSharded: false,
				tokenSecret: Math.random().toString(36).substr(2),
				clientSecret: clientSecret,
				callbackURL: callbackURL,
				owner: owner,
				"inviteLink": "/dashboard/@me",
				"supportServer": supportServer,
				"introText": config.introText,
				"footerText": config.footerText
			};

			configNew.featureOne = config.featureOne;
			configNew.featureTwo = config.featureTwo;
			configNew.featureThree = config.featureThree;
			configNew.featureFour = config.featureFour;
			configNew.navItems = config.navItems

			let settings = JSON.stringify(configNew);
			require("fs").writeFileSync(dashboardConfigPath, settings, "utf8");
		} catch (error) {
			require("fs").writeFileSync("dashboard-errors.txt", error, "utf8");
		};
	},

	//---------------------------------------------------------------------
	// Extension On Load
	//
	// If an extension has a function for "load", it will be called
	// whenever the editor loads data.
	//
	// The "DBM" parameter is the global variable. Store loaded data within it.
	//---------------------------------------------------------------------

	load: function (DBM, projectLoc) {},

	//---------------------------------------------------------------------
	// Extension On Save
	//
	// If an extension has a function for "save", it will be called
	// whenever the editor saves data.
	//
	// The "data" parameter contains all data. Use this to modify
	// the data that is saved. The properties correspond to the
	// data file names:
	//
	//  - data.commands
	//  - data.settings
	// etc...
	//---------------------------------------------------------------------

	save: function (DBM, data, projectLoc) {},

	//---------------------------------------------------------------------
	// Editor Extension Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//
	// This is absolutely necessary for editor extensions since it
	// allows us to setup modifications for the necessary functions
	// we want to change.
	//
	// The client object can be retrieved from: `const bot = DBM.Bot.bot;`
	// Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
	//---------------------------------------------------------------------

	mod: function (DBM) {

		DBM.require = function (packageName) {
			const path = require("path");
			const nodeModulesPath = path.join(__dirname, "dbm_dashboard_extension", "node_modules", packageName);
			return require(nodeModulesPath)
		}

		const express = DBM.require('express'),
			{ fs, readdirSync } = require("fs"),
			path = DBM.require('path'),
			chalk = DBM.require('chalk'),
			bodyParser = DBM.require('body-parser'),
			cookieParser = DBM.require('cookie-parser'),
			ejs = DBM.require('ejs'),
			Strategy = DBM.require('passport-discord').Strategy,
			session = DBM.require('express-session'),
			passport = DBM.require('passport'),
			{ dashboardConfig, ready
			} = require('../extensions/dbm_dashboard_extension/functions');

		var app = express();
		var config = dashboardConfig()
		app.actions = new Map()

		// Pulls all of the files from actions to be used as mods!
		readdirSync('./extensions/dbm_dashboard_extension/actions').forEach(dir => {
			const actions = readdirSync(`./extensions/dbm_dashboard_extension/actions/${dir}/`).filter(file => file.endsWith('.js'));
		for (let file of actions) {
			let pull = require(`../extensions/dbm_dashboard_extension/actions/${dir}/${file}`);
			app.actions.set(pull.name, pull);
			console.log(chalk.green(`Successfully loaded ${pull.name}`)) 
		}
	})

		// We wait for the bot to be ready so these dmb nerds dont break it
		DBM.Bot.onReady = function () {
			const client = DBM.Bot.bot;
			let scopes = ['identify', 'guilds'];
            //
			// Define the express server settings
			app.set('view engine', 'ejs');
			app.use(express.static(path.join(__dirname, '/dbm_dashboard_extension/public')));
			app.set('views', path.join(__dirname, '/dbm_dashboard_extension/views'));
			app.use(cookieParser(config.tokenSecret));
			app.use(session({
				secret: config.tokenSecret,
				resave: false,
				saveUninitialized: false
			}));
			app.use(bodyParser.urlencoded({
				extended: true
			}));
			app.use(passport.initialize());
			app.use(passport.session());
			passport.serializeUser(function (user, done) {
				done(null, user);
			});
			passport.deserializeUser(function (obj, done) {
				done(null, obj);
			});

			passport.use(new Strategy({
				clientID: DBM.Bot.bot.user.id,
				clientSecret: config.clientSecret,
				callbackURL: config.callbackURL,
				scope: scopes
			}, (accessToken, refreshToken, profile, done) => {
				process.nextTick(() => {
					return done(null, profile);
				});
			}));

			app.get('/login', passport.authenticate('discord', {
				scope: scopes
			}), function (req, res) {});

			app.get('/dashboard/callback',
				passport.authenticate('discord', {
					failureRedirect: '/dashboard/@me'
				}),
				function (req, res) {
					if (req.user.id == config.owner) return res.redirect('/dashboard/admin')
					res.redirect('/dashboard/@me');
				}
			);

			app.get('/', function (req, res) {
				res.render('homePage', {
					config: config,
					client: DBM.Bot.bot
				});
			});

			app.get('/dashboard/@me', checkAuth, function (req, res) {
				res.render('servers', {
					guilds: req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591),
					user: req.user,
					config: config,
					client: DBM.Bot.bot
				});
			});

			app.get('/dashboard/@me/servers/:guildID', checkAuth, function (req, res) {
				let serv = client.guilds.get(req.params.guildID);
				if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${DBM.Bot.bot.user.id}&scope=bot&permissions=2146958591&guild_id=${req.params.guildID}`);
				let dashboardMods = [];
				app.actions.forEach(data => { if (data.dashboardMod == true) dashboardMods.push(data) });
				if (!DBM.Bot.bot.log) DBM.Bot.bot.log = 'Command Executed';
				res.render('dashboardPanel', {
					client: DBM.Bot.bot,
					server: serv,
					dashboardMods: dashboardMods,
					customHtml: false,
					log: DBM.Bot.bot.log,
					config: config,
					commandExecuted: false,
				})
			});

			app.get('/dashboard/@me/servers/:guildID/:action', checkAuth, function (req, res) {
				let serv = client.guilds.get(req.params.guildID);
				if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${DBM.Bot.bot.user.id}&scope=bot&permissions=2146958591&guild_id=${req.params.guildID}`);
				var action = req.params.action;
				let data = app.actions.get(action);
				let dashboardMods = [];
				app.actions.forEach(data => { if (data.dashboardMod == true) dashboardMods.push(data) });
				res.render('dashboardPanel', {
					dashboardMods: dashboardMods,
					commandExecuted: req.user.dashboardCommandExecuted,
					customHtml: data.customHtml,
					action: data,
					log: DBM.Bot.bot.log,
					client: DBM.Bot.bot,
					config: config,
					server: serv
				});
				dashboardCommandExecuted(req, false);
			});

			app.get('/dashboard/admin', checkAuthOwner, function (req, res) {
				let config = dashboardConfig();
				let dashboardMods = [];
				app.actions.forEach(data => { if (data.dashboardMod == false) dashboardMods.push(data) });
				if (!DBM.Bot.bot.log) DBM.Bot.bot.log = 'Command Executed';
				res.render('adminPanel', {
					dashboardMods: dashboardMods,
					commandExecuted: req.user.commandExecuted,
					customHtml: false,
					log: DBM.Bot.bot.log,
					client: DBM.Bot.bot,
					config: config
				});
				if (req.user.commandExecuted) DBM.Bot.bot.log = 'Command Executed';
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

				let settings = JSON.stringify(config);
				require("fs").writeFileSync(dashboardConfigPath, settings, "utf8");
				res.redirect('/')
			})

			app.get('/dashboard/admin/:action', checkAuthOwner, function (req, res) {
				var action = req.params.action;
				let data = app.actions.get(action);
				let dashboardMods = [];
				app.actions.forEach(data => { if (data.dashboardMod == false) dashboardMods.push(data) });
				res.render('adminPanel', {
					dashboardMods: dashboardMods,
					commandExecuted: false,
					customHtml: true,
					action: data,
					log: DBM.Bot.bot.log,
					client: DBM.Bot.bot,
					config: config
				});
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
							updateCommandExecuted(req, true);
							res.redirect('/dashboard/admin');
						};
					} else {
						res.redirect(`/dashboard/admin/${data.name}`);
					};
				} else {
					data.run(DBM.Bot.bot, req, res);
					if (data.next) {
						updateCommandExecuted(req, true);
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
							res.redirect(`http://localhost:3000/dashboard/@me/servers/${serv.id}`);
							dashboardCommandExecuted(req, false);
						};
					} else {
						res.redirect(`http://localhost:3000/dashboard/@me/servers/${serv.id}/${data.name}`);
						dashboardCommandExecuted(req, false);
					};
				} else {
					data.run(DBM.Bot.bot, req, res, serv);
					if (data.next) {
						dashboardCommandExecuted(req, true);
						res.redirect(`http://localhost:3000/dashboard/@me/servers/${serv.id}/${data.name}`);
						dashboardCommandExecuted(req, false);
					};
				};
			});

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

			function updateCommandExecuted(req, commandExecuted) {
				req.user.commandExecuted = commandExecuted;
			};

			function dashboardCommandExecuted(req, dashboardCommandExecuted) {
				req.user.dashboardCommandExecuted = dashboardCommandExecuted;
			};
			
			app.listen(config.port, () => ready());
		};
	}
};