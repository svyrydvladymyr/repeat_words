const db_config = {
    driver: "mysql",
    host: "localhost",
    user: "root",
    password: "root",
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
    prefix: '',
    strict: false,
    database: "repeat_words"
};
const mysql = require('mysql');
const con = mysql.createConnection(db_config);
con.connect((err) => {
    if (err) {
    console.log("err-connect-to-db", err);
    // res.send(err);       
    }});  

setInterval(function () { con.query('SELECT 1') }, 10000);
module.exports = { con }; 