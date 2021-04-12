const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {log, accessLog} = require('./modules/service');
const {autorisationRouts, autorisationSocial} = require('./modules/autorisation.js');
const {users} = require('./db/createDB');
const {renderMain, renderSettings, renderFriends} = require('./modules/renderPage');
const passport = require('passport'); 
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.serializeUser(function(user, done) {done(null, user)});  
passport.deserializeUser(function(obj, done) {done(null, obj)});
app.use(passport.initialize());

// Facebook Strategy
// passport.use(new FacebookStrategy({
//     clientID: '435548787037664',
//     clientSecret: '1a2fde88089878abfa800a93a0fccbd0',
//     callbackURL: "https://svyrydvladymyr.herokuapp.com/facebookcallback",
//     profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
// }, function(accessToken, refreshToken, profile, done) {process.nextTick(function () {autorisationSocial(profile, done)})}));
// app.get('/facebook', passport.authenticate('facebook'));
// app.get('/facebookcallback', function(req, res, next) {passport.authenticate('facebook', function(err, user, info) {autorisRouts(req, res, err, user)})(req, res, next)});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: '850886948666-sh4u40cuq24s930mk3h99q4jmmscskec.apps.googleusercontent.com',
    clientSecret: '4QdHCDoBTs6L3rFEA4F0BzEe',
    callbackURL: "http://127.0.0.1:4000/googlecallback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
  }, (accessToken, refreshToken, profile, done) => {process.nextTick(() => {autorisationSocial(profile, done)})}));
app.get('/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']}));
app.get('/googlecallback', (req, res, next) => {passport.authenticate('google', (err, user, info) => {autorisationRouts(req, res, err, user)})(req, res, next)});



  
// // LinkedIn Strategy
// passport.use(new LinkedInStrategy({
//     clientID: '77jpxeqvndbl8a',
//     clientSecret: 'nG1r67j9cDA4gmU8',
//     callbackURL: "https://svyrydvladymyr.herokuapp.com/linkedincallback",
//     profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
//   },  function(accessToken, refreshToken, profile, done) {process.nextTick(function () {autorisationSocial(profile, done)})}));
// app.get('/linkedin', passport.authenticate('linkedin'));
// app.get('/linkedincallback', function(req, res, next) {passport.authenticate('linkedin', function(err, user, info) {autorisRouts(req, res, err, user)})(req, res, next)});




//template engineer
app.set('views', __dirname + '/templates'); 
app.set('view engine', 'ejs');

//static files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//logs
app.use((req, res, next) => {log(`////////-${req.method}-//////////`, req.url); next();});

//logs
app.use((req, res, next) => {accessLog(req, res, next)});

//pages
app.use('/settings', (req, res) => {renderSettings(req, res)});
app.use('/friends', (req, res) => {renderFriends(req, res)});
app.use('/', (req, res) => {renderMain(req, res)});

app.get('/$', (req, res, next) => {res.redirect('index')});
app.get('*', (req, res) => {res.status(404).send(pageNotFound);});

app.listen(process.env.PORT || 4000, () => {console.log('Server is running...')});