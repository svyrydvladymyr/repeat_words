const con = require('../db/connectToDB').con;
const {log, clienttoken, getTableRecord, readyFullDate, langName, langList, voiceList} = require('./service');
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
    return await getTableRecord(`SELECT * FROM users WHERE token = '${clienttoken(req, res)}'`)
    .then((user) => {
        if (user.err) {
            throw new Error(user.err);
        } else if (user == '') {  
            throw new Error('the-user-is-not-authorized');
        } else {

            // console.log('birthday', user[0].birthday);
            // console.log('email' ,user[0].email);
            // console.log('emailverified' ,user[0].emailverified);

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
            // console.log( readyFullDate(user[0].date_registered, 'reverse'));
            return `SELECT * FROM userssettings WHERE userid = '${user[0].userid}'`;
        };
    })
    .then(getTableRecord)
    .then((userssettings) => {
        if (userssettings.err) {
            log("settings-request-error", userssettings.code);
        } else if (userssettings == '') {
            log("not-found-settings-record", userssettings);
            con.query(`INSERT INTO userssettings (userid) VALUES ('${DATA.user.id}')`, (err, result) => {
                log("settings-added", result ? result.affectedRows : err.code);        
            });  
        } else {
            DATA.usersett.spead = userssettings[0].speed;
            DATA.usersett.pitch = userssettings[0].pitch;
            DATA.usersett.voice = userssettings[0].voice;
            DATA.usersett.lang = userssettings[0].my_lang;
            DATA.usersett.color = userssettings[0].color;
            DATA.usersett.interface = (userssettings[0].interface === 'my') ? userssettings[0].my_lang : 'en-US';
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
        return DATA.user.id;       
    })            
    .catch((err) => {
        log('error-get-user-info', err); 
        DATA.permission.permAuthorised = 0;                
        return DATA.user.id;
    });
};



module.exports = {
    addUser,
    isUser,
    getUser,
    clearDATA,
    DATA
}