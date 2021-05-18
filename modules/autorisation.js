const con = require('../db/connectToDB').con;
const {token, log, addCookies, clienttoken, getTableRecord} = require('./service');
const {renderPage} = require('./renderPage');
// const Cookies = require('cookies');


//render page if bad autorization 
const renderNotPage = (req, res, err) => {
    res.render(`notfound`, {
        // permissAccess: `${permissionAccess}`,
        // permissEdit: `${permissionEdit}`,
        // permissName: ``,
        // permissSurname: ``,
        // permissUserid: ``,
        // onindex:`err_autoriz`,
        // setsettings:`false`,
        // errautoriz:`${err}`,
        // userid: ``,
        // activee: `noactive`,
        // title:``
    });
};

const autorisationSocial = (profile, done) => {
    console.log(profile);
    con.query(`SELECT * FROM users WHERE userid = '${profile.id}'`, (error, result) => {
        const user = { id : profile.id,
                ava : profile.photos === undefined ? '' : `${profile.photos[0].value}`,
                name : profile.name.givenName === undefined ? '' : `${profile.name.givenName}`,
                surname : profile.name.familyName === undefined ? '' : `${profile.name.familyName}`,
                email : profile.emails === undefined ? '' : `${profile.emails[0].value}`,
                provider : profile.provider === undefined ? '' : `${profile.provider}`
            };
        if (error) { 
            done(`Problem with created user: ${error}`, null); 
        } else if (result && result.length === 0) {   
            const date = new Date();        
            const sql = `INSERT INTO users (userid, name, surname, email, date_registered, ava, provider) 
                       VALUES ('${user.id}', 
                       '${user.name}', 
                       '${user.surname}', 
                       '${user.email}', 
                       '${date.toISOString().slice(0,10)} ${date.getHours()}:${date.getMinutes()}', 
                       '${user.ava}', 
                       '${user.provider}')`;     
            con.query(sql, (error, result) => {
                if (error) { 
                    done(`Error creating user record: ${error}`, null) 
                } else {
                    log("user-registered", result ? result.affectedRows : null);
                    con.query(`INSERT INTO userssettings (userid) VALUES ('${user.id}')`, (err, result) => {
                        log("settings-added", result ? result.affectedRows : err.code);       
                        return done(null, profile);              
                    });  
                };              
            }); 
        } else if (result[0].userid === user.id){
            log("user-is-already-authorized", user.id);
            con.query(`UPDATE users SET name = '${user.name}', surname = '${user.surname}', ava = '${user.ava}' WHERE userid = '${user.id}'`, (err, result) => {
                log("updade-user-data", result ? result.affectedRows : err.code)
            });
            con.query(`SELECT email FROM users WHERE userid = '${profile.id}'`, (error, result) => {
                if (result && result[0].email === null) {
                    user.email !== '' ? con.query(`UPDATE users SET email = '${user.email}' WHERE userid = '${user.id}'`, (err, result) => {
                        log("updade-user-email", result ? result.affectedRows : err.code)
                    }) : null;
                };
            });
            return done(null, profile);
        } else {
            return done(`code-error`, null);
        }; 
    }); 
};

const SetCookie = (req, res, user) => {
    const tokenId = token(20);
    con.query(`UPDATE users SET token = '${tokenId}' WHERE userid = '${user.id}'`, (error, result) => {
        if (error) { 
            addCookies(req, res, '', '-1');
            renderPage(req, res, 'main', `Token update error: ${error}`); 
        } else {        
            addCookies(req, res, tokenId, '');    
            res.redirect('/'); 
        };          
    });    
};

const autorisationCheck = async (req, res) => {
    return await getTableRecord(`SELECT userid FROM users WHERE token = '${clienttoken(req, res)}'`)
    .then((user) => { 
        return (user.err || user == '') ? false : user[0].userid; 
    });
};



module.exports = {
    SetCookie,
    autorisationSocial,
    renderNotPage,
    autorisationCheck
}