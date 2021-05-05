const {log, getTableRecord, langList} = require('./service');
const {autorisationCheck} = require('./autorisation');
const con = require('../db/connectToDB').con;

const setSettings = (req, res) => {
    const type = req.body.type, value = req.body.value,

    // my_lang = ['en-US', 'uk-UA', 'it-IT', 'de-DE', 'fr-FR', 'es-ES', 'zh-CN', 'pl-PL', 'ru-RU'],

    color = ['blue', 'red', 'green', 'yellow', 'grey'],
    typeArr = ['speed', 'pitch', 'voice', 'my_lang', 'interface', 'color'];
    let access = false, param = false, typeParam = false;

    console.log('type', req.body.type);
    console.log('value', req.body.value);
    console.log('valueIS', !isNaN(req.body.value));

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
            };
                
            langList.push('en-US', 'my');
            langList.forEach(e => { if (e === value) {param = true} });
            langList.splice(-2, 2);

            // console.log('fdfdfdf', langList);

            color.forEach(e => { if (e === value) {param = true} });
            if (typeParam && param) { access = true };    

            console.log('type', type);
            console.log('param', param);
            console.log('access', access);
            console.log('type', type);
            console.log('value', value);
            return userid;
        };
    })
    .then((userid) => {        
        if (access) {
            let interfaceLang, interfaceParam;
            con.query(`UPDATE userssettings SET ${type} = '${value}' WHERE userid = '${userid}'`, (err, result) => {
                log(`updade-user-settings-${type}`, result ? result.affectedRows : err.code)
            });
            getTableRecord(`SELECT interface, my_lang FROM userssettings WHERE userid = '${userid}'`)
            .then((val) => {
                interfaceLang = (val.err || val == '') ? 'en-US' : val[0].my_lang;
                interfaceParam = (val.err || val == '') ? 'en-US' : val[0].interface;

                console.log(val);
                console.log(val[0].my_lang);
                console.log(val[0].interface);
                
            })
            .then(() => {
                if (type === 'interface') {
                    (value === 'en-US') ? res.send(require(`./lang/${value}`)) : res.send(require(`./lang/${interfaceLang}`));
                } else if (type === 'my_lang') {    
    
                    console.log('fghfghfgh', interfaceParam);

                    if (interfaceParam === 'en-US') {
                        res.send({"res": value});
                    } else {
                        res.send(require(`./lang/${interfaceLang}`));
                    };                
                } else {
                    res.send({"res": value});
                }
            });
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