const con = require('../db/connectToDB').con;
const renderPage = require('./renderPage');
const Users = require('./user');

module.exports = (app) => {
    const passport = require('passport');  
    const StrategyConfig = require('../config/config-oauth');
    const Strategy = {
        google: require('passport-google-oauth20').Strategy,
        facebook: require('passport-facebook').Strategy,
        linkedin: require('passport-linkedin-oauth2').Strategy
    };
    passport.serializeUser(function(user, done) {done(null, user)});  
    passport.deserializeUser(function(obj, done) {done(null, obj)});
    app.use(passport.initialize());
    ['google', 'facebook', 'linkedin'].forEach(url => {
        passport.use(
            new Strategy[url](StrategyConfig[url], 
            (accessToken, refreshToken, profile, done) => {process.nextTick( async () => {
                con.query(`SELECT * FROM users WHERE userid = '${profile.id}'`, (error, result) => {
                    if (error) { 
                        done(`Problem with created user: ${error}`, null); 
                    } else if (result && result.length === 0) {   
                        Users.addUser(profile, done);
                    } else if (result[0].userid === profile.id){
                        Users.isUser(profile);
                        return done(null, profile);
                    } else {
                        return done(`Problem with created user: code-error`, null);
                    }; 
                }); 
            })})
        );        
        app.get(`/${url}`, 
            passport.authenticate(`${url}`, 
                (url === 'google') ? {scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']} : ''
            ));
        app.get(`/${url}callback`, (req, res, next) => {    
            passport.authenticate(`${url}`, 
                (err, user, info) => { 
                    if (err) renderPage(req, res, 'main', err);
                    if (!err) {
                        const tokenId = require('./service').token(20);
                        con.query(`UPDATE users SET token = '${tokenId}' WHERE userid = '${user.id}'`, (error, result) => {
                            if (error) { 
                                require('./service').addCookies(req, res, '', '-1');
                                renderPage(req, res, 'main', `Token update error: ${error}`); 
                            } else {        
                                require('./service').addCookies(req, res, tokenId, '');    
                                res.redirect('/'); 
                            };          
                        });  
                    };
                }
            )(req, res, next);
        });
    });
}