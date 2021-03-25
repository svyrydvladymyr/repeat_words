const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {pageNotFound} = require('./modules/service');
const {renderMain, renderSettings} = require('./modules/renderPage');




// let passport = require('passport'); 
// let FacebookStrategy = require('passport-facebook').Strategy;
// let GoogleStrategy = require('passport-google-oauth20').Strategy;
// let GitHubStrategy = require('passport-github').Strategy;



// passport.serializeUser(function(user, done) {done(null, user)});  
// passport.deserializeUser(function(obj, done) {done(null, obj)});
// app.use(passport.initialize());


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
// passport.use(new GoogleStrategy({
//     clientID: '422337007127-73a8ofjsl3a6n7kesl3tnk0c11jo4ou6.apps.googleusercontent.com',
//     clientSecret: '1J24VS_1Yrk27ZZCgs5NMk60',
//     callbackURL: "https://svyrydvladymyr.herokuapp.com/googlecallback",
//     profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
//   },  function(accessToken, refreshToken, profile, done) {process.nextTick(function () {autorisationSocial(profile, done)})}));
// app.get('/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']}));
// app.get('/googlecallback', function(req, res, next) {passport.authenticate('google', function(err, user, info) {autorisRouts(req, res, err, user)})(req, res, next)});

// GitHub Strategy
// passport.use(new GitHubStrategy({
//     clientID: '306581483c8927ca31b4',
//     clientSecret: '13853ceb1fc550a6027df1efee453a9f941fd683',
//     callbackURL: "https://svyrydvladymyr.herokuapp.com/githubcallback",
//     profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
//   },  function(accessToken, refreshToken, profile, done) {process.nextTick(function () {autorisationSocial(profile, done)})}));
// app.get('/github', passport.authenticate('github'));
// app.get('/githubcallback', function(req, res, next) {passport.authenticate('github', function(err, user, info) {autorisRouts(req, res, err, user)})(req, res, next)});






//template engineer
app.set('views', __dirname + '/templates'); 
app.set('view engine', 'ejs');

//static files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());



//pages
app.use('/settings', (req, res) => {renderSettings(req, res)});
app.use('/', (req, res) => {renderMain(req, res)});
// app.use('/:pageid$', (req, res) => {renderPage(req, res)});

app.get('/$', (req, res, next) => {res.redirect('index')});
app.get('*', (req, res) => {res.status(404).send(pageNotFound);});

app.listen(process.env.PORT || 4000, () => {console.log('Server is running...')});