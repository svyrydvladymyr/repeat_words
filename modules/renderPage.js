const {log, clienttoken} = require('./service');
const con = require('../db/connectToDB').con;

const DATA = {
    errors : {
        errMessage : '',
        SERVER_ERROR : ''
    },
    permission : {
        permViews : '',
        permAccess : '',
        permAuthorised : 0
    },
    user : {
        name : 'Name',
        surname : 'Surname',
        foto : 'img/no_user.png'
    },
    usersett : {
        name : '',
        surname : '',
        foto : ''
    }
};

const renderPage = (req, res, pageName = 'main', err = '') => {
    if (err !== '') {
        DATA.errors.SERVER_ERROR = `SERVER ERROR: ${err}`;
        res.render(pageName, { DATA }); 
    } else {        
        // const clientToken = clienttoken(req, res);
        // log("clientToken", clientToken);
        const getUser = (sql) => {
            return new Promise((resolve, reject) => {                   
                con.query(sql, function (err, result) { err ? resolve({'err': err}) : resolve(result) });    
            });
        };
        getUser(`SELECT * FROM users WHERE token = '${clienttoken(req, res)}'`)
            .then((user) => {
                if (user.err) {
                    throw new Error(user.err);
                } else if (user == '') {                    
                    throw new Error('the-user-is-not-authorized');
                } else {
                    console.log('ID----', user[0].userid);

                    DATA.user.name = user[0].name;
                    DATA.user.surname = user[0].surname;
                    DATA.user.foto = user[0].ava;
                    DATA.permission.permAuthorised = 1;
                    return `SELECT * FROM userssettings WHERE userid = '${user[0].userid}'`;
                };                  
            })
            .then(getUser)    
            .then((userssettings) => {                
                if (userssettings.err) {
                    log("settings-request-error", userssettings);
                } else if (userssettings == '') {
                    log("no-settings-record-found", userssettings);
                } else {
                    console.log('settings----', userssettings[0].speed);

                    return userssettings[0].userid;
                }; 
                
            
            })  
            
            .then((userID) => {
                log("11111111111111", userID);
            })
            .then(() => {

                res.render(pageName, { DATA });
            
            })
            .catch((err) => {

                log('error-render-page', err); 
                DATA.permission.permAuthorised = 0;
                res.render(pageName, { DATA });

            });       
    };
};



module.exports = {
    renderPage
};