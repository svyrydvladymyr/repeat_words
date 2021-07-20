const con = require('../db/connectToDB').con;
const moment = require('moment');

const {log, getTableRecord, validEmail, autorisationCheck} = require('./service');
const {langList, voiceList} = require('./config');


const setSettings = (req, res) => {
    const type = req.body.type, value = req.body.value;
          let access = false, interfaceLang, interfaceParam;
    // console.log('type', req.body.type);
    // console.log('value', req.body.value);
    // console.log('valueIS', !isNaN(req.body.value));
    autorisationCheck(req, res)
    .then((user) => {
        if (user === false) {throw new Error('error-autorisation')};
        switch (type) {
            case 'speed':
                if (value >= 0.5 && value <= 2) { access = true };
                break;
            case 'pitch':
                if (value >= 0 && value <= 2) { access = true };
                break;
            case 'voice':
                voiceList.forEach(el => { 
                    if (el === value) { access = true };
                }); 
                break;
            case 'my_lang':
                langList.forEach(el => { 
                    if (el === value) { access = true };
                });
                break;
            case 'interface':
                langList.push('en-US', 'my');
                langList.forEach(el => { 
                    if (el === value) { access = true };
                });
                langList.splice(-2, 2);
                break;
            case 'color':
                ['blue', 'red', 'green', 'yellow', 'grey'].forEach(el => { 
                    if (el === value) { access = true };
                });
                break;
            case 'gender':
                if ((value === 'venus' || value === 'mars')) { access = true };
                break;
            case 'birthday':
                if (moment(value, 'YYYY-MM-DD', true).isValid()) { access = true };
                break;
            case 'emailverified':
                if (validEmail(value) || value === 'null') {  access = true };
                break;
        };

        console.log('birthday_valid', moment(value, 'YYYY-MM-DD', true).isValid());
        console.log('type', type);
        console.log('value', value);
        console.log('access', access);

        return user;        
    })
    .then((user) => {     
        if (!access) {throw new Error('bad-request')};        
        con.query(`UPDATE users SET ${type} = '${value}' WHERE userid = '${user.userid}'`, (err, result) => {
            log(`updade-user-info-${type}`, result ? result.affectedRows : err)
        });                  
        return {my_lang: (type === 'my_lang') ? value : user.my_lang, interface: user.interface};
    })
    .then((lang) => {
        interfaceLang = (lang.my_lang === '') ? 'en-US' : lang.my_lang;
        interfaceParam = (lang.interface === '') ? 'en-US' : lang.interface; 
        if (type === 'gender') {
            const translitName = (interfaceParam === 'my') 
            ? require(`./lang/${interfaceLang}`)[`${value}`] 
            : require(`./lang/en-US`)[`${value}`];
            res.send({"res": `${translitName} <i class='fa fa-${value}'></i>`});
        } else if (type === 'interface') {
            (value === 'en-US') 
            ? res.send(require(`./lang/${value}`)) 
            : res.send(require(`./lang/${interfaceLang}`));
        } else if (type === 'my_lang') {    
            (interfaceParam === 'en-US') 
            ? res.send({"res": value}) 
            : res.send(require(`./lang/${interfaceLang}`));    
        } else {
            res.send({"res": (value == 'null') ? '' : value});
        };
    })
    .catch((err) => {
        log('settings-error', err);
        res.status(500).send('SERVER ERROR: 500 (Internal Server Error)');
    });    
};

module.exports = {
    setSettings
};