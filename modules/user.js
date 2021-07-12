const con = require('../db/connectToDB').con;
const {log, clienttoken, getTableRecord, autorisationCheck, readyFullDate} = require('./service');
const {langName, langList, voiceList} = require('./config');
const moment = require('moment');

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
        name : '',
        surname : '',
        foto : 'img/no_user.png',
        email : '',
        birthday : '',
        gender : '',
        provider : '',
        date_registered : ''
    },
    usersett : {
        spead : 1,
        pitch : 1,
        voice : 'Google UK English Female',
        lang : 'none',
        interface : 'en-US',
        color : 'blue'
    },
    langPack : require('./lang/en-US'),
    langList : [],
    langName : [],
    voiceList : []
};

const clearDATA = () => {
    DATA.user.id = '';
    DATA.user.name = '';
    DATA.user.surname = '';
    DATA.user.foto = 'img/no_user.png';
    DATA.user.birthday = '';
    DATA.user.gender = '';
    DATA.user.email = '';
    DATA.user.provider = '';
    DATA.user.date_registered = '';
    DATA.usersett.spead = 1;
    DATA.usersett.pitch = 1;
    DATA.usersett.voice = 'Google UK English Female';
    DATA.usersett.lang = 'none';
    DATA.usersett.interface = 'en-US';
    DATA.usersett.color = 'blue';
    DATA.permission.permAuthorised = 0; 
    DATA.errors.errMessage = '';
    DATA.errors.SERVER_ERROR = '';
    DATA.langPack = require('./lang/en-US');
    DATA.langList = [];
    DATA.langName = [];
    DATA.voiceList = [];
};

const addUser = (profile, done) => {
    const date = new Date();        
    const sql = `INSERT INTO users (userid, name, surname, email, date_registered, ava, provider) 
               VALUES ('${profile.id}', 
               '${profile.name.givenName === undefined ? "" : profile.name.givenName}', 
               '${profile.name.familyName === undefined ? "" : profile.name.familyName}', 
               '${profile.emails === undefined ? "" : profile.emails[0].value}', 
               '${date.toISOString().slice(0,10)} ${date.getHours()}:${date.getMinutes()}', 
               '${profile.photos === undefined ? "" : profile.photos[0].value}', 
               '${profile.provider === undefined ? "" : profile.provider}')`;     
    con.query(sql, (error, result) => {
        error 
            ? done(`Error creating user record: ${error}`, null) 
            : done(null, profile);
    });
};

const isUser = (profile) => {
    con.query(`UPDATE users SET 
        name = '${profile.name.givenName === undefined ? "" : profile.name.givenName}', 
        surname = '${profile.name.givenName === undefined ? "" : profile.name.givenName}', 
        ava = '${profile.photos === undefined ? "" : profile.photos[0].value}' 
    WHERE userid = '${profile.id}'`, (err, result) => { 
        if (err) { log("error-update-user", err.code) };
    });
};

const getUser = async (req, res, pageName) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') }; 
        await Promise.all([
            getTableRecord(`SELECT * FROM users WHERE userid = '${userid}'`), 
            getTableRecord(`SELECT * FROM userssettings WHERE userid = '${userid}'`)
        ])
        .then((user_data) => {
            const user = user_data[0];       
            if (user.err) {
                throw new Error(user.err);
            } else if (user == '') { 
                throw new Error('error-autorisation');
            } else {
                DATA.user.id = user[0].userid;
                DATA.user.name = user[0].name;
                DATA.user.surname = user[0].surname;
                DATA.user.foto = user[0].ava;
                DATA.permission.permAuthorised = 1;
                if (pageName === 'profile') {
                    const birthday = (user[0].birthday !== null && user[0].birthday !== '') ? moment(user[0].birthday).format('YYYY-MM-DD') : '';
                    const email = (user[0].emailverified === 'null' || user[0].emailverified === '') ? user[0].email : user[0].emailverified;
                    DATA.user.email = (email === 'null') ? '' : email;
                    DATA.user.birthday = birthday;
                    DATA.user.gender = user[0].gender;
                    DATA.user.provider = user[0].provider;
                    DATA.user.date_registered = readyFullDate(user[0].date_registered, 'reverse');
                }           
                return user_data;
            };        
        })
        .then((user_data) => {
            const userssettings = user_data[1];  
            if (userssettings.err) {
                log("settings-request-error", userssettings.err);
            } else if (userssettings == '') {
                log("not-found-settings-record", userssettings);
                con.query(`INSERT INTO userssettings (userid) VALUES ('${DATA.user.id}')`, (err, result) => {
                    log("settings-record-created", result ? result.affectedRows : err.code);        
                });  
            } else {
                let myLanguage = 'none';
                langList.forEach(el => { if (userssettings[0].my_lang === el) {myLanguage = userssettings[0].my_lang} });
                DATA.usersett.spead = userssettings[0].speed;
                DATA.usersett.pitch = userssettings[0].pitch;
                DATA.usersett.voice = userssettings[0].voice;
                DATA.usersett.lang = myLanguage;
                DATA.usersett.color = userssettings[0].color;
                DATA.usersett.interface = (userssettings[0].interface === 'my' && myLanguage !== 'none') ? userssettings[0].my_lang : 'en-US';
                if (pageName === 'settings') {
                    DATA.langList = langList;
                    DATA.voiceList = voiceList;
                }
                if (pageName === 'main') {
                    let param = true;
                    langList.forEach(el => { if (el === DATA.usersett.lang) {param = false} });
                    if (param) {
                        DATA.usersett.lang = 'none';
                        DATA.langList = langList;
                        DATA.langName = langName;
                    };
                };
            };   
            return DATA.usersett.interface;       
        })   
        .then((lang) => {
            let access = false, langPack;
            langList.push('en-US');    
            langList.forEach(e => { if (e === lang) {access = true} });
            langList.pop();
            try {
                langPack = require(`./lang/${lang}`);
            } catch(e) {
                langPack = require(`./lang/en-US`);
                DATA.usersett.interface = 'en-US';
                log('Module is not found', 0); 
            }
            if (access) { DATA.langPack = langPack };
        });
    })
    .catch((err) => {
        log('error-user-info', err); 
        DATA.permission.permAuthorised = 0;   
    }); 
};

module.exports = {
    addUser,
    isUser,
    getUser,
    clearDATA,
    DATA
}