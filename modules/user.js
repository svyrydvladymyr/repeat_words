const con = require('../db/connectToDB').con;
const {log, getTableRecord, autorisationCheck, readyFullDate} = require('./service');
const {langName, langList, voiceList} = require('../config/config_variables');
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
    const {id, name: {givenName = '', familyName = ''}, emails: [{value: email = ''}], photos: [{value: photo = ''}], provider} = profile;
    const date = new Date();        
    const sql = `INSERT INTO users (userid, name, surname, email, date_registered, ava, provider) 
               VALUES ('${id}', 
               '${givenName}', 
               '${familyName}', 
               '${email}', 
               '${date.toISOString().slice(0,10)} ${date.getHours()}:${date.getMinutes()}', 
               '${photo}', 
               '${provider}')`;     
    con.query(sql, (error, result) => {
        error 
            ? done(`Error creating user record: ${error}`, null) 
            : done(null, profile);
    });
};

const isUser = ({id, name: {familyName = '', givenName = ''}, photos: [{value: photo = ''}]}) => {
    con.query(`UPDATE users SET 
        name = '${givenName}', 
        surname = '${familyName}', 
        ava = '${photo}'
    WHERE userid = '${id}'`, (err, result) => { 
        if (err) { log("error-update-user", err.code) };
    });
};

const getUser = async (req, res, pageName) => {
    await autorisationCheck(req, res)
    .then(async (userid) => {
        if (userid === false) { throw new Error('error-autorisation') };
        await getTableRecord(`SELECT * FROM users WHERE userid = '${userid.userid}'`)
        .then((user) => {
            if (user.err) { throw new Error(user.err) };
            const {userid, name, surname, ava, birthday, gender,
                   speed, pitch, voice, color, interface, my_lang,  
                   emailverified, email, provider, date_registered} = user[0];
            let myLanguage = langList.includes(my_lang) ? my_lang : 'none';
            
            console.log('myLanguage', myLanguage);

            //permission
            DATA.permission.permAuthorised = 1;
            //user
            DATA.user.id = userid;
            DATA.user.name = name;
            DATA.user.surname = surname;
            DATA.user.foto = ava;
            //usersettings
            DATA.usersett.spead = speed;
            DATA.usersett.pitch = pitch;
            DATA.usersett.voice = voice;
            DATA.usersett.lang = myLanguage;
            DATA.usersett.color = color;
            DATA.usersett.interface = (interface === 'my' && myLanguage !== 'none') ? my_lang : 'en-US';
            if (pageName === 'profile') {
                const birthdayVer = (birthday !== null && birthday !== '') ? moment(birthday).format('YYYY-MM-DD') : '';
                const emailVer = (emailverified === 'null' || emailverified === '') ? email : emailverified;
                DATA.user.email = (emailVer === 'null') ? '' : emailVer;
                DATA.user.birthday = birthdayVer;
                DATA.user.gender = gender;
                DATA.user.provider = provider;
                DATA.user.date_registered = readyFullDate(date_registered, 'reverse');
            };
            if (pageName === 'settings') {
                DATA.langList = langList;
                DATA.voiceList = voiceList;
            };
            if ((pageName === 'main') || (pageName === 'search-words')) {
                if (langList.includes(DATA.usersett.lang) ? false : true) {
                    DATA.usersett.lang = 'none';
                    DATA.langList = langList;
                    DATA.langName = langName;
                };
            };
            return DATA.usersett.interface;       
        })   
        .then((lang) => {
            let langPack;
            const access = [...langList, 'en-US', 'my'].includes(lang) ? true : false; 
            try {
                langPack = require(`./lang/${lang}`);
            } catch(e) {
                langPack = require(`./lang/en-US`);
                DATA.usersett.interface = 'en-US';
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