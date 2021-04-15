const con = require('./connectToDB').con;


const users = () => {
    const sql = `CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL UNIQUE,
        token VARCHAR(30),
        ava VARCHAR(255), 
        name VARCHAR(80) NOT NULL, 
        surname VARCHAR(80) NOT NULL,
        email VARCHAR(60),
        birthday VARCHAR(11),
        country VARCHAR(40),                   
        provider VARCHAR(40),                   
        date_registered DATETIME                          
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table users created")});
}

const userssettings = () => {
    const sql = `CREATE TABLE userssettings (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL UNIQUE,
        interface_lang VARCHAR(20),                   
        my_lang VARCHAR(20),    
        voice INT DEFAULT '4',                   
        speed VARCHAR(40) DEFAULT '1', 
        pitch VARCHAR(40) DEFAULT '1'            
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table userssettings created")});
}


module.exports = {
    users,
    userssettings
};