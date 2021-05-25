const {log, getTableRecord, langList, voiceList} = require('./service');
const {autorisationCheck} = require('./autorisation');
const con = require('../db/connectToDB').con;

const setSettings = (req, res) => {
    const type = req.body.type, value = req.body.value,
          color = ['blue', 'red', 'green', 'yellow', 'grey'],
          typeArr = ['speed', 'pitch', 'voice', 'my_lang', 'interface', 'color', 'gender', 'birthday'];    
          let access = false, param = false, typeParam = false, interfaceLang, interfaceParam;
    // console.log('type', req.body.type);
    // console.log('value', req.body.value);
    // console.log('valueIS', !isNaN(req.body.value));
    autorisationCheck(req, res)
    .then((userid) => {
        if (userid === false) {
            throw new Error('error-autorisation');
        } else {
            typeArr.forEach(e => { if (e === type) {typeParam = true} });
            if (!isNaN(value)) {
                if (typeParam && (value >= 0.5 && value <= 2)) { access = true };
                if (typeParam && (value >= 0 && value <= 2)) { access = true };
                if (typeParam && (value >= 0 && value <= 20)) { access = true };                
            };                
            langList.push('en-US', 'my');
            langList.forEach(el => { if (el === value) {param = true} });
            langList.splice(-2, 2);
            voiceList.forEach(el => { if (el === value) {param = true} });
            color.forEach(el => { if (el === value) {param = true} });
            if (typeParam && param) { access = true };    
            if (typeParam && (value === 'venus' || value === 'mars')) { access = true };    


            console.log('type', type);
            console.log('value', value);
            console.log('param', param);
            console.log('access', access);


            return userid;
        };
    })
    .then((userid) => {        
        if (access) {
            if (type === 'gender' || type === 'birthday') {
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
            res.send({"res": value});
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