const {log, clienttoken, addCookies, getTableRecord} = require('./service');
const con = require('../db/connectToDB').con;

const DATA = {
    errors : {
        errMessage : '',
        SERVER_ERROR : ''
    },
    permission : {
        permViews : '',
        permAccess : '',
        permAuthorised : 0
    },
    user : {
        id : '',
        name : 'Name',
        surname : 'Surname',
        foto : 'img/no_user.png'
    },
    usersett : {
        spead : 1,
        pitch : 1,
        voice : 4,
        lang : 'uk-UA',
        color : 'blue'
    },
    langPack : require('./lang/uk-UA')
};

const clearDATA = () => {
    DATA.user.id = '';
    DATA.user.name = 'Name';
    DATA.user.surname = 'Surname';
    DATA.user.foto = 'img/no_user.png';
    DATA.usersett.spead = 1;
    DATA.usersett.pitch = 1;
    DATA.usersett.voice = 4;
    DATA.usersett.lang = 'uk-UA';
    DATA.usersett.color = 'blue';
    DATA.permission.permAuthorised = 0; 
    DATA.errors.errMessage = '';
    DATA.errors.SERVER_ERROR = '';
    DATA.langPack = require('./lang/uk-UA');
};


const getUser = async (req, res) => {
    return await getTableRecord(`SELECT * FROM users WHERE token = '${clienttoken(req, res)}'`)
    .then((user) => {
        if (user.err) {
            throw new Error(user.err);
        } else if (user == '') {  
            throw new Error('the-user-is-not-authorized');
        } else {
            DATA.user.id = user[0].userid;
            DATA.user.name = user[0].name;
            DATA.user.surname = user[0].surname;
            DATA.user.foto = user[0].ava;
            DATA.permission.permAuthorised = 1;
            return `SELECT * FROM userssettings WHERE userid = '${user[0].userid}'`;
        };
    })
    .then(getTableRecord)
    .then((userssettings) => {
        if (userssettings.err) {
            log("settings-request-error", userssettings.code);
        } else if (userssettings == '') {
            log("not-found-settings-record", userssettings);
        } else {
            DATA.usersett.spead = userssettings[0].speed;
            DATA.usersett.pitch = userssettings[0].pitch;
            DATA.usersett.voice = userssettings[0].voice;
            DATA.usersett.lang = userssettings[0].my_lang;
            DATA.usersett.color = userssettings[0].color;
        };     
        return userssettings[0].my_lang;       
    })            
    .then((lang) => {
        let access = false, langPack;
        ['uk-UA', 'it-IT', 'de-DE', 'fr-FR', 'es-ES', 'zh-CN', 'pl-PL', 'ru-RU'].forEach(e => { 
            if (e === lang) {access = true} 
        });
        try {
            langPack = require(`./lang/${lang}`);
        } catch(e) {
            langPack = require(`./lang/uk-UA`);
            DATA.usersett.lang = 'uk-UA';
            log('Module is not found', 0); 
        }
        if (access) { DATA.langPack = langPack };
        return DATA.user.id;       
    })            
    .catch((err) => {
        log('error-get-user-info', err); 
        DATA.permission.permAuthorised = 0;                
        return DATA.user.id;
    });
};


// const getUser222 = async (id) => {   
//     return await getTableRecord(`SELECT * FROM userssettings WHERE userid = '${id}'`)
//     .then((userssettings) => {
//         log("5555555550000", id);
//         log("555555555userssettings", userssettings);
//     })
//     .then(() => {
//         return 'next'; 
//     })
// };

const renderPage = (req, res, pageName = 'main', err = '') => {
    clearDATA();
    if (err !== '') {        
        DATA.errors.SERVER_ERROR = `SERVER ERROR: ${err}`;
        res.render(pageName, { DATA }); 
    } else {
        if (pageName === 'exit') {
            addCookies(req, res, '', '-1');
            res.redirect('/'); 
        } else {           
            getUser(req, res)
            // .then(() => { log("DATA", DATA) })
            .then(() => { res.render(pageName, { DATA }) });
        };   
    };
};

module.exports = {
    renderPage,
    getTableRecord
};