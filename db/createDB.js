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
        registrdata DATE                          
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table users created")});
}


module.exports = {
    users
};