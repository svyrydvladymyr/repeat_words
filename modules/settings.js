const {log, getTableRecord, langList} = require('./service');
const {autorisationCheck} = require('./autorisation');
const con = require('../db/connectToDB').con;

const setSettings = (req, res) => {
    const type = req.body.type, value = req.body.value,
          color = ['blue', 'red', 'green', 'yellow', 'grey'],
          typeArr = ['speed', 'pitch', 'voice', 'my_lang', 'interface', 'color'];
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
            langList.forEach(e => { if (e === value) {param = true} });
            langList.splice(-2, 2);
            color.forEach(e => { if (e === value) {param = true} });
            if (typeParam && param) { access = true };    
            // console.log('type', type);
            // console.log('param', param);
            // console.log('access', access);
            // console.log('type', type);
            // console.log('value', value);
            return userid;
        };
    })
    .then((userid) => {        
        if (access) {
            con.query(`UPDATE userssettings SET ${type} = '${value}' WHERE userid = '${userid}'`, (err, result) => {
                log(`updade-user-settings-${type}`, result ? result.affectedRows : err.code)
            });                    
            return `SELECT interface, my_lang FROM userssettings WHERE userid = '${userid}'`; 
        } else {
            throw new Error('bad-request');        
        };
    })
    .then(getTableRecord)
    .then((val) => {
        interfaceLang = (val.err || val == '') ? 'en-US' : val[0].my_lang;
        interfaceParam = (val.err || val == '') ? 'en-US' : val[0].interface; 
        if (type === 'interface') {
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