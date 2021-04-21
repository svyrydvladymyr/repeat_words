const {log} = require('./service');
const {autorisationCheck} = require('./autorisation');
const con = require('../db/connectToDB').con;

const setSettings = (req, res) => {
    const type = req.body.type, value = req.body.value; 
    let access = false;

    console.log('type', req.body.type);
    console.log('value', req.body.value);
    console.log('valueIS', !isNaN(req.body.value));

    if (!isNaN(value)) {
        if (type === 'speed' && (value >= 0.5 && value <= 2)) { access = true };
        if (type === 'pitch' && (value >= 0 && value <= 2)) { access = true };
        if (type === 'voice' && (value >= 0 && value <= 20)) { access = true };
    }

    console.log('access', access);
    console.log('type', type);
    console.log('value', value);

    autorisationCheck(req, res)
    .then((userid) => {
        if (userid === false) {
            throw new Error('error-autorisation');
        } else {
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
    })
    
};

module.exports = {
    setSettings
};