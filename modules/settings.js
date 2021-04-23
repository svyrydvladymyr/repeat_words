const {log} = require('./service');
const {autorisationCheck} = require('./autorisation');
const con = require('../db/connectToDB').con;

const setSettings = (req, res) => {
    const type = req.body.type, value = req.body.value,
    my_lang = ['uk-UA', 'it-IT', 'de-DE', 'fr-FR', 'es-ES', 'zh-CN', 'pl-PL', 'ru-RU'],
    color = ['blue', 'red', 'green', 'yellow', 'grey'],
    typeArr = ['speed', 'pitch', 'voice', 'my_lang', 'color'];
    let access = false, param = false, typeParam = false;

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
                if (type && (value >= 0.5 && value <= 2)) { access = true };
                if (type && (value >= 0 && value <= 2)) { access = true };
                if (type && (value >= 0 && value <= 20)) { access = true };                
            }    
            my_lang.forEach(e => { if (e === value) {param = true} });
            color.forEach(e => { if (e === value) {param = true} });
            if (type && param) { access = true };    

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
            res.send({"userid": userid});
        } else {
            res.send({"error":"bad-request"});
        }
    })
    .catch((err) => {
        log(err);
        res.send({"error":"error-autorisation-err"});
    });    
};

module.exports = {
    setSettings
};