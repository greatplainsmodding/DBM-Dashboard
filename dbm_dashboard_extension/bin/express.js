module.exports = function (DBM) {
    let Dashboard = DBM.Dashboard;

    // Require needed modules
    const express = Dashboard.requireModule('express'),
        {
            fs,
            readdirSync
        } = require("fs"),
        chalk = Dashboard.requireModule('chalk'),
        bodyParser = Dashboard.requireModule('body-parser'),
        cookieParser = Dashboard.requireModule('cookie-parser'),
        ejs = Dashboard.requireModule('ejs'),
        Strategy = Dashboard.requireModule('passport-discord').Strategy,
        session = Dashboard.requireModule('express-session'),
        path = Dashboard.requireModule('path'),
        passport = Dashboard.requireModule('passport');

    const client = DBM.Bot.bot;
    let scopes = ['identify', 'guilds'];

    // Define the express server settings
    Dashboard.app.set('view engine', 'ejs');
    Dashboard.app.use(express.static(path.join(__dirname, '../public')));
    Dashboard.app.set('views', path.join(__dirname, '../views'));
    Dashboard.app.use(cookieParser(Dashboard.config.tokenSecret));
    Dashboard.app.use(session({
        secret: Dashboard.config.tokenSecret,
        resave: false,
        saveUninitialized: false
    }));
    Dashboard.app.use(bodyParser.urlencoded({
        extended: true
    }));
    Dashboard.app.use(passport.initialize());
    Dashboard.app.use(passport.session());
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new Strategy({
        clientID: DBM.Bot.bot.user.id,
        clientSecret: Dashboard.config.clientSecret,
        callbackURL: Dashboard.config.callbackURL,
        scope: scopes
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            return done(null, profile);
        });
    }));

    Dashboard.app.get('/login', passport.authenticate('discord', {
        scope: scopes
    }), function (req, res) {});

    Dashboard.app.get('/dashboard/callback',
        passport.authenticate('discord', {
            failureRedirect: '/failed'
        }),
        function (req, res) {
            Dashboard.adminCommandExecuted(req, false)
            Dashboard.dashboardCommandExecuted(req, false)
            if (req.user.id == Dashboard.config.owner) return res.redirect('/dashboard/admin');
            res.redirect('/dashboard/@me');
        }
    );

    // Startup the dashboard!!!
    Dashboard.loadActions();
    Dashboard.loadRoutes();
    Dashboard.loadThemes();
    Dashboard.loadCustomRoutes();

    Dashboard.app.listen(Dashboard.config.port, () => Dashboard.onReady());
}