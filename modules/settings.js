const con = require('../db/connectToDB').con;
const moment = require('moment');

const {log, validEmail, autorisationCheck} = require('./service');
const {langList, voiceList, colorList, interfaceList} = require('./config');


const setSettings = (req, res) => {
    const type = req.body.type, value = req.body.value;
    let access = false, interfaceLang, interfaceParam;
    autorisationCheck(req, res)
    .then((user) => {
        if (user === false) {throw new Error('error-autorisation')};
        class Verification {
            constructor(value){ this.value = value }            
            speed() { return this.value >= 0.5 && this.value <= 2 ? true : false }
            pitch() { return this.value >= 0 && this.value <= 2 ? true : false }
            voice() { return voiceList.includes(value) }
            my_lang() { return langList.includes(value) }
            interface() { return langList.concat(interfaceList).includes(value) }
            color() { return colorList.includes(value) }
            gender() { return value === 'venus' || value === 'mars' ? true : false }
            birthday() { return moment(value, 'YYYY-MM-DD', true).isValid() ? true : false }
            emailverified() { return validEmail(value) || value === 'null' ? true : false }
        }
        access = new Verification(value)[type]();

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