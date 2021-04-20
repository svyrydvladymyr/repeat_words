const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {users, userssettings} = require('./db/createDB');
const {log, accessLog} = require('./modules/service');
const {SetCookie, autorisationSocial} = require('./modules/autorisation.js');
const {renderPage} = require('./modules/renderPage');
const passport = require('passport'); 
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.serializeUser(function(user, done) {done(null, user)});  
passport.deserializeUser(function(obj, done) {done(null, obj)});
app.use(passport.initialize());

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: '744992919507683',
    clientSecret: '15aa89e9733c0d21c3fd0ed675225c8c',
    callbackURL: "https://127.0.0.1:4000/facebookcallback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
}, function(accessToken, refreshToken, profile, done) {process.nextTick(() => {autorisationSocial(profile, done)})}));
app.get('/facebook', passport.authenticate('facebook'));
app.get('/facebookcallback', (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    err 
      ? renderPage(req, res, 'main', err) 
      : SetCookie(req, res, user);
  })(req, res, next)});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: '850886948666-sh4u40cuq24s930mk3h99q4jmmscskec.apps.googleusercontent.com',
    clientSecret: '4QdHCDoBTs6L3rFEA4F0BzEe',
    callbackURL: "http://127.0.0.1:4000/googlecallback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
  }, (accessToken, refreshToken, profile, done) => {process.nextTick(() => {autorisationSocial(profile, done)})}));
app.get('/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']}));
app.get('/googlecallback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    err 
      ? renderPage(req, res, 'main', err) 
      : SetCookie(req, res, user);
  })(req, res, next)});
  
// // LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: '77hth4uk65ijf5',
    clientSecret: 'ENs2YGvVz0WJf846',
    callbackURL: "http://127.0.0.1:4000/linkedincallback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
  }, (accessToken, refreshToken, profile, done) => {process.nextTick(() => {autorisationSocial(profile, done)})}));
app.get('/linkedin', passport.authenticate('linkedin'));
app.get('/linkedincallback', (req, res, next) => {
  passport.authenticate('linkedin', (err, user, info) => {
    err 
      ? renderPage(req, res, 'main', err) 
      : SetCookie(req, res, user);
  })(req, res, next)});

//template engineer
app.set('views', __dirname + '/templates'); 
app.set('view engine', 'ejs');

//static files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//console logs
app.use((req, res, next) => {log(`URL-REQUEST:-(${req.method})-`, req.url); next();});

//system logs
app.use((req, res, next) => {accessLog(req, res, next)});

//pages
app.use('/settings', (req, res) => {renderPage(req, res, 'settings')});
app.use('/friends', (req, res) => {renderPage(req, res, 'friends')});
app.use('/exit', (req, res) => {renderPage(req, res, 'exit')});
app.use('/', (req, res) => {renderPage(req, res)});

app.get('/$', (req, res, next) => {res.redirect('index')});
app.get('*', (req, res) => {res.status(404).send(pageNotFound);});

//server listen
app.listen(process.env.PORT || 4000, () => {console.log('Server is running...')});