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

	fields: [
		"port", "clientSecret", "callbackURL", "owner", "supportServer"
	],

	//---------------------------------------------------------------------
	// Default Fields
	//
	// The default values of the fields.
	//---------------------------------------------------------------------

	defaultFields: {
		port: require('../extensions/dbm_dashboard_extension/config.json').port,
		clientSecret: require('../extensions/dbm_dashboard_extension/config.json').clientSecret,
		callbackURL: require('../extensions/dbm_dashboard_extension/config.json').callbackURL,
		owner: require('../extensions/dbm_dashboard_extension/config.json').owner,
		supportServer: require('../extensions/dbm_dashboard_extension/config.json').supportServer
	},

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
					<input type="text" value="${data.port}" class="round" style="padding-bottom: 3px;" id="port"><br>
					clientSecret:<br>
					<input type="text" value="${data.clientSecret}" class="round" id="clientSecret"><br>
					callbackURL:<br>
					<input type="text" value="${data.callbackURL}" class="round" id="callbackURL"><br>
					Owner ID:<br>
					<input type="text" value="${data.owner}" class="round" id="owner"><br>
					supportServer:<br>
					<input type="text" value="${data.supportServer}" class="round" id="supportServer"><br>
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
		data.port = String(document.getElementById("port").value);
		data.clientSecret = String(document.getElementById("clientSecret").value);
		data.callbackURL = String(document.getElementById("callbackURL").value);
		data.owner = String(document.getElementById("owner").value);
		data.supportServer = String(document.getElementById("supportServer").value);

		try {
			const config = require('./dbm_dashboard_extension/config.json');
			const dashboardConfigPath = require("path").join(__dirname, "../extensions", "dbm_dashboard_extension", "config.json");
			const configNew = {
				port: data.port,
				isBotSharded: false,
				tokenSecret: Math.random().toString(36).substr(2),
				clientSecret: data.clientSecret,
				callbackURL: data.callbackURL,
				owner: data.owner,
				inviteLink: "/dashboard/@me",
				supportServer: data.supportServer,
				introText: config.introText,
				footerText: config.footerText,
				theme: "default",
				isGlitch: config.isGlitch
			};

			configNew.featureOne = config.featureOne;
			configNew.featureTwo = config.featureTwo;
			configNew.featureThree = config.featureThree;
			configNew.featureFour = config.featureFour;
			configNew.navItems = config.navItems;

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

	load: function (DBM, projectLoc) {

	},

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

	save: function (DBM, data, projectLoc) {

	},

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
		const Dashboard = DBM.Dashboard = {};
		Dashboard.version = '1.0.1'
		Dashboard.lastPage = new Map();
		Dashboard.actionsExecuted = new Map();

		Dashboard.devMode = false;
		Dashboard.config = require('./dbm_dashboard_extension/config.json');

		Dashboard.init = function () {
			// Pulls everything needed from the bin folder
			require('./dbm_dashboard_extension/bin/functions')(Dashboard);
			require('./dbm_dashboard_extension/bin/actionsManager')(DBM);

			// Require needed modules
			const express = Dashboard.requireModule('express')

			Dashboard.app = express();
			Dashboard.themes = new Map();
			Dashboard.routes = new Map();
			Dashboard.actions = new Map();

			// We wait for the bot to be ready so these dmb nerds don't break it
			DBM.DashboardOnReady = DBM.Bot.onReady || {};
			DBM.Bot.onReady = function () {
				// Start the express server
				require('./dbm_dashboard_extension/bin/dashboard')(DBM);
				require('./dbm_dashboard_extension/bin/express')(DBM);
				DBM.DashboardOnReady.apply(this, arguments);
			};
		}

		Dashboard.onCommandExecute = function (req, command) {
			let data = {
				user: req.user,
				command: command
			}
			return data
		};

		Dashboard.onLogin = function (req) {
			return req
		}

		Dashboard.theme = function () {
			let theme = Dashboard.themes.get(Dashboard.config.theme);
			return theme
		}

		Dashboard.verifyConfig = function () {
			if (!Dashboard.config.owner) return 'Please enter your user ID in the config.';
			if (!Dashboard.config.port) return 'Please enter a port in the config.';
			if (!Dashboard.config.clientSecret) return 'Please enter a client secrete in the config.';
			if (!Dashboard.config.callbackURL) return 'Please enter a callback url in the config.';
			if (!Dashboard.config.tokenSecret) return 'Please enter a token secret in the config.';

		}

		// Start the dashboard 
		if (Dashboard.verifyConfig()) {
			console.log("-------------------------------------------------------------------------------------------------");
			console.log(require('chalk').yellow(require('figlet').textSync('DBM Dashboard', { horizontalLayout: 'full' })));
			console.log("-------------------------------------------------------------------------------------------------");
			console.log(require('chalk').white('-'), require('chalk').red("Creator:"), require('chalk').white('Great Plains Modding'));
			console.log(require('chalk').white('-'), require('chalk').red("Version:"), require('chalk').white('1.0.0'));
			console.log(require('chalk').white('-'), require('chalk').red("Port:"), require('chalk').white(Dashboard.config.port));
			console.log(require('chalk').white('-'), require('chalk').red("isBotSharded:"), require('chalk').white(Dashboard.config.isBotSharded));
			console.log(require('chalk').white('-'), require('chalk').red("Client Secret:"), require('chalk').white(Dashboard.config.clientSecret));
			console.log(require('chalk').white('-'), require('chalk').red("Callback Url:"), require('chalk').white(Dashboard.config.callbackURL));
			console.log(require('chalk').white('-'), require('chalk').red("DBM Network:"), require('chalk').white('https://discord.gg/3QxkZPK'));
			console.log("-------------------------------------------------------------------------------------------------");
			console.log(require('chalk').white('- Error:'), require('chalk').red(Dashboard.verifyConfig()));
			console.log("-------------------------------------------------------------------------------------------------");
			return
		}
		Dashboard.init();
	}
};