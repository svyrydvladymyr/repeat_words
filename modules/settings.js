const con = require('../db/connectToDB').con;
const moment = require('moment');

const {log, getTableRecord, validEmail, langList, voiceList} = require('./service');
const {autorisationCheck} = require('./service');


const setSettings = (req, res) => {
    const type = req.body.type, value = req.body.value;
          let access = false, interfaceLang, interfaceParam;
    // console.log('type', req.body.type);
    // console.log('value', req.body.value);
    // console.log('valueIS', !isNaN(req.body.value));
    autorisationCheck(req, res)
    .then((userid) => {
        if (userid === false) {
            throw new Error('error-autorisation');
        } else {
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
            }

            console.log('birthday_valid', moment(value, 'YYYY-MM-DD', true).isValid());
            console.log('type', type);
            console.log('value', value);
            console.log('access', access);

            return userid;
        };
    })
    .then((userid) => {        
        if (access) {
            if (type === 'gender' || type === 'birthday'|| type === 'emailverified') {
                con.query(`UPDATE users SET ${type} = '${value}' WHERE userid = '${userid}'`, (err, result) => {
                    log(`updade-user-info-${type}`, result ? result.affectedRows : err)
                }); 
            } else {
                con.query(`UPDATE userssettings SET ${type} = '${value}' WHERE userid = '${userid}'`, (err, result) => {
                    log(`updade-user-settings-${type}`, result ? result.affectedRows : err)
                }); 
            };                   
            return `SELECT interface, my_lang FROM userssettings WHERE userid = '${userid}'`; 
        } else {
            throw new Error('bad-request');        
        };
    })
    .then(getTableRecord)
    .then((val) => {
        interfaceLang = (val.err || val == '') ? 'en-US' : val[0].my_lang;
        interfaceParam = (val.err || val == '') ? 'en-US' : val[0].interface; 
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
        log('error', err);
        res.send({"error": err.message});
    });    
};

module.exports = {
    setSettings
};