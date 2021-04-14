const con = require('../db/connectToDB').con;
const {token, clienttoken, pageNotFound, log} = require('./service');
const {renderPage} = require('./renderPage');
const Cookies = require('cookies');


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
    // console.log(profile);
    con.query(`SELECT * FROM users WHERE userid = '${profile.id}'`, (error, result) => {
        const user = { id : profile.id,
                ava : profile.photos === undefined ? '' : `${profile.photos[0].value}`,
                name : profile.name.givenName === undefined ? '' : `${profile.name.givenName}`,
                surname : profile.name.familyName === undefined ? '' : `${profile.name.familyName}`,
                email : profile.emails === undefined ? '' : `${profile.emails[0].value}`,
                provider : profile.provider === undefined ? '' : `${profile.provider}`
            };
        (error) ? done(`Problem with created user: ${error}`, null) : null;  
        if (result && result.length === 0) {   
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
                (error) ? done(`Error creating user record: ${error}`, null) : null;
                log("user-registered", result.affectedRows);
                con.query(`INSERT INTO userssettings (userid) VALUES ('${user.id}')`, (err, result) => {
                    log("settings-added", result ? result.affectedRows : err.code);       
                    return done(null, profile);              
                });                
            }); 
        } else if (result[0].userid === user.id){
            log("user-is-already-authorized", user.id);
            con.query(`UPDATE users SET name = '${user.name}' WHERE userid = '${user.id}'`, (err, result) => {log("setted-new-name", result.affectedRows)});
            con.query(`UPDATE users SET surname = '${user.surname}' WHERE userid = '${user.id}'`, (err, result) => {log("setted-new-surname", result.affectedRows)});
            con.query(`UPDATE users SET ava = '${user.ava}' WHERE userid = '${user.id}'`, (err, result) => {log("setted-new-ava", result.affectedRows)});
            user.email !== '' ? con.query(`UPDATE users SET email = '${user.email}' WHERE userid = '${user.id}'`, (err, result) => {log("setted-new-email", result.affectedRows)}) : null;
            return done(null, profile);
        } else {return done(`code-error`, null)}; 
    }); 
};

const autorisationSetCookie = (req, res, user) => {
    const tokenId = token(20);
    con.query(`UPDATE users SET token = '${tokenId}' WHERE useridu = '${user.id}'`, (error, result) => {
        if (error) { 
            renderPage(req, res, 'main', `Token update error: ${error}`); 
        } else {
            const cookies = new Cookies(req, res, {"keys":['volodymyr']});
            cookies.set('sessionisdd', `${tokenId}`, {maxAge: '', path: '/', signed:true});
            res.redirect('/'); 
        };          
    });    
};


module.exports = {
    autorisationSetCookie,
    autorisationSocial,
    renderNotPage,
}