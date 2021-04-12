const con = require('../db/connectToDB').con;
const {token, clienttoken, pageNotFound, log} = require('./service');
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
    // let id = profile.provider === 'linkedin' ? profile.id.replace(/-/gi, '') : profile.id;


    console.log("profile", profile);
    return done(null, profile);
    // con.query(`SELECT * FROM users WHERE userid = '${id}'`, (err, result) => {
    //     let ava, name, surname, emailadd, provider, emailprovider;
    //     if (profile.provider === 'linkedin'){
    //         ava = profile.photos === undefined ? '' : `${profile.photos[2].value}`;
    //         name = profile.name.givenName === undefined ? '' : `${profile.name.givenName}`;
    //         surname = profile.name.familyName === undefined ? '' : `${profile.name.familyName}`;
    //         emailadd = '';
    //         provider = profile.provider === undefined ? '' : `${profile.provider}`;
    //         emailprovider = profile.provider === undefined ? '' : `${profile.provider}`;
    //     } else {
    //         ava = profile.photos === undefined ? '' : `${profile.photos[0].value}`;
    //         name = profile.name.givenName === undefined ? '' : `${profile.name.givenName}`;
    //         surname = profile.name.familyName === undefined ? '' : `${profile.name.familyName}`;
    //         emailadd = profile.emails === undefined ? '' : `${profile.emails[0].value}`;
    //         provider = profile.provider === undefined ? '' : `${profile.provider}`;
    //         emailprovider = profile.provider === undefined ? '' : `${profile.provider}`;
    //     }
    //     if(err) {
    //         $_log("err-autoriz", err);  
    //         return done(null, profile);             
    //     } else if (result && result.length === 0) {
    //         $_log("register-user-with-social", result);
    //         let sql = `INSERT INTO users (userid, name, surname, login, password, ${emailprovider}email, active, regtype, registrdata, ava) 
    //                    VALUES ('${id}', '${name}', '${surname}', '${token(10)}', '${token(10)}', '${emailadd}', 'active', '${provider}', '${new Date().toISOString().slice(0,10)}', '${ava}')`;
    //         let sqlsett = `INSERT INTO userssettings (userid) VALUES ('${id}')`;          
    //         con.query(sql, function (err, result) {
    //             if (err) {
    //                 $_log("err-with-social-registr", err);                 
    //                 if (err.code === 'ER_DUP_ENTRY'){
    //                     let parseSQLmess = err.sqlMessage.slice(err.sqlMessage.length - 6,  err.sqlMessage.length - 1);
    //                     return (parseSQLmess === 'login') ? done('ER_DUP_LOGIN', null) : (parseSQLmess === 'email') ? done('ER_DUP_EMAIL', null) : done(`${err}`, null);
    //                 } else {
    //                     return done(`${err}`, null);
    //                 }
    //             } else {
    //                 con.query(sqlsett, function (err, result) {
    //                     if (err){
    //                         $_log("err-create-row-settinds", err);
    //                         let sqldel = `DELETE FROM users WHERE userid = ${id}`;
    //                         con.query(sqldel, function (err, result) {
    //                             if (err){
    //                                 $_log("err-clear-user-if-fail", err);
    //                             } else {
    //                                 $_log("result-user-clear", result.affectedRows);
    //                                 return done('ER_SERVER', null);
    //                             }
    //                         });
    //                     } else {
    //                         $_log("result-add-row-settings", result.affectedRows);
    //                         return done(null, profile);
    //                     }  
    //                 });
    //             }
    //         }); 
    //     } else if (result[0].userid === id){
    //         $_log("user-is-authorized", id);
    //         let emailproviderrr = profile.provider === undefined ? 'email' : `${profile.provider}email`;
    //         con.query(`UPDATE users SET name = '${name}' WHERE userid = '${id}'`, function (err, result) {$_log("set-new-name", result.affectedRows)});
    //         con.query(`UPDATE users SET surname = '${surname}' WHERE userid = '${id}'`, function (err, result) {$_log("set-new-surname", result.affectedRows)});
    //         con.query(`UPDATE users SET ava = '${ava}' WHERE userid = '${id}'`, function (err, result) {$_log("set-new-ava", result.affectedRows)});
    //         if ((emailadd !== '') && (emailadd !== undefined)){
    //             con.query(`UPDATE users SET ${emailproviderrr} = '${emailadd}' WHERE userid = '${id}'`, function (err, result) {$_log("set-new-email", result.affectedRows)});
    //         }
    //         return done(null, profile);
    //     }
    // }); 
};

const autorisationSetCookie = (req, res, user) => {
    console.log("setcukie", user);

    res.redirect('/');
    // let id = user.provider === 'linkedin' ? user.id.replace(/-/gi, '') : user.id;
    // let tokenId = token(20);
    // let sql = `UPDATE users SET token = '${tokenId}' WHERE userid = '${id}'`;
    // con.query(sql, function (err, result) {
    //     if (err) {
    //         $_log("err", err);
    //         res.redirect('/');
    //     } else {
    //         $_log("result-autoriz", result.changedRows);
    //         if (result.changedRows === 0){
    //             let cookies = new Cookies(req, res, {"keys":['volodymyr']});
    //             cookies.set('sessionisdd', ``, {maxAge: '-1', path: '/', signed:true}); 
    //             res.redirect(id);
    //         } else {              
    //             let sqlsel = `SELECT U.*, S.* FROM users U INNER JOIN userssettings S on U.userid=S.userid WHERE U.userid = '${id}'`;
    //             con.query(sqlsel, function (err, result) {
    //                 if (err) {
    //                     $_log("err", err);
    //                     res.redirect(id);
    //                 } else {
    //                     $_log("result-userSett", result[0].userid);
    //                     let cookies = new Cookies(req, res, {"keys":['volodymyr']});
    //                     cookies.set('sessionisdd', `${tokenId}`, {maxAge: '', path: '/', signed:true});
    //                     res.render(`nouser`, {
    //                         permissAccess: `${(result[0].token === clienttoken(req, res)) ? true : false}`,
    //                         permissEdit: `${(result[0].token === clienttoken(req, res)) ? true : false}`,
    //                         permissName: `${result[0].name}`,
    //                         permissSurname: `${result[0].surname}`,
    //                         permissUserid: `${result[0].userid}`,
    //                         onindex:`verifyuser`,
    //                         setsettings:`true`,
    //                         userid: ``,
    //                         activee: `active`,
    //                         title:``,
    //                         maincolor:`${result[0].maincolor}`,
    //                         secondcolor:`${result[0].secondcolor}`,
    //                         bgcolor:`${result[0].bgcolor}`,
    //                         topleft:`${result[0].bordertl}`,
    //                         topright:`${result[0].bordertr}`,
    //                         bottomleft:`${result[0].borderbl}`,
    //                         bottomright:`${result[0].borderbr}`,
    //                         font:`${result[0].fonts}`,
    //                         lang:`${result[0].language}`
    //                     });                 
    //                 }
    //             }); 
    //         }           
    //     }
    // });    
}

const autorisationRouts = (req, res, err, user) => {

    console.log("routes", user);
    if(err){
        (err === 'ER_SERVER') ? renderNotPage(req, res, 'error_server') : res.redirect('/');  
    } else {
        autorisationSetCookie(req, res, user); 
    };    
};

module.exports = {
    autorisationRouts,
    renderNotPage,
    autorisationSocial
}