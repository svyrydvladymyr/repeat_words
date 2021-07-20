const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const {users, words} = require('./db/createDB');
const {log, accessLog, logOut} = require('./modules/service');

const {setSettings} = require('./modules/settings');

const renderPage = require('./modules/renderPage');
const searchWord = require('./modules/search');

//oaugh
require('./modules/oaugh.js')(app);

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

//requests
app.use('/setsettings', (req, res) => {setSettings(req, res)});
app.use('/search-word', (req, res) => {searchWord(req, res)});

//pages
app.get('/repeat-words', (req, res) => {renderPage(req, res, 'repeat-words')});
app.get('/search-words', (req, res) => {renderPage(req, res, 'search-words')});
app.get('/profile', (req, res) => {renderPage(req, res, 'profile')});
app.get('/settings', (req, res) => {renderPage(req, res, 'settings')});
app.get('/friends', (req, res) => {renderPage(req, res, 'friends')});

//logout
app.post('/exit', (req, res) => {logOut(req, res)});

app.get('/', (req, res) => {renderPage(req, res, 'main')});
app.get('*', (req, res) => {res.status(404).send(require('./config/404'));});

//server listen
app.listen(process.env.PORT || 4000, () => {console.log('Server is running...')});