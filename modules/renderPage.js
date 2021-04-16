const {log, clienttoken} = require('./service');
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
        lang : 'en-US',
        langInterface : 'en-US'
    }
};

const clearDATA = (paran) => {
    switch (paran) {
        case 'user':
            DATA.user.id = '';
            DATA.user.name = 'Name';
            DATA.user.surname = 'Surname';
            DATA.user.foto = 'img/no_user.png';
            break;
        case 'usersett':
            DATA.usersett.spead = 1,
            DATA.usersett.pitch = 1,
            DATA.usersett.voice = 4,
            DATA.usersett.lang = 'en-US',
            DATA.usersett.langInterface = 'en-US'
            break;
        case 'permission':
            DATA.permission.permAuthorised = 0; 
            break;
        case 'errors':
            DATA.errors.errMessage = '',
            DATA.errors.SERVER_ERROR = ''
            break;
        default:
            DATA.user.id = '';
            DATA.user.name = 'Name';
            DATA.user.surname = 'Surname';
            DATA.user.foto = 'img/no_user.png';
            DATA.usersett.spead = 1,
            DATA.usersett.pitch = 1,
            DATA.usersett.voice = 4,
            DATA.usersett.lang = 'en-US',
            DATA.usersett.langInterface = 'en-US'
            DATA.permission.permAuthorised = 0; 
            DATA.errors.errMessage = '',
            DATA.errors.SERVER_ERROR = ''
            break;
    };   
};

const getTableRecord = (sql) => {
    return new Promise((resolve, reject) => {                   
        con.query(sql, function (err, result) { err ? resolve({'err': err}) : resolve(result) });    
    });
};

const getUser = (req, res, pageName) => {
    getTableRecord(`SELECT * FROM users WHERE token = '${clienttoken(req, res)}'`)
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
            DATA.usersett.langInterface = userssettings[0].interface_lang;                    
        };     
        return DATA.user.id;       
    })            
    .then((userID) => {
        log("11111111111111", userID);
        log("11111111111111", DATA);
    })
    .then(() => {
        
    })
    .catch((err) => {
        log('error-get-user-info', err); 
        DATA.permission.permAuthorised = 0;                
        res.render(pageName, { DATA });
    });  
};

const renderPage = (req, res, pageName = 'main', err = '') => {
    clearDATA('');
    if (err !== '') {        
        DATA.errors.SERVER_ERROR = `SERVER ERROR: ${err}`;
        res.render(pageName, { DATA }); 
    } else {
        
        return new Promise((resolve) => {resolve()})
        .then(() => {
            return getUser(req, res, pageName)
        })
        .then(() => {
            res.render(pageName, { DATA });
        })
        
    };
};

module.exports = {
    renderPage
};