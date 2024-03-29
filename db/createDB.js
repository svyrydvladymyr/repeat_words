const con = require('./connectToDB').con;

const users = () => {
    const sql = `CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL UNIQUE,
        token VARCHAR(30),
        ava VARCHAR(255), 
        name VARCHAR(80) NOT NULL, 
        surname VARCHAR(80) NOT NULL,
        email VARCHAR(60) DEFAULT '',
        emailverified VARCHAR(60) DEFAULT '',
        birthday DATE,
        gender VARCHAR(11) DEFAULT '',
        provider VARCHAR(40),
        interface VARCHAR(20) DEFAULT 'en-US',    
        my_lang VARCHAR(20) DEFAULT 'none',    
        voice VARCHAR(60) DEFAULT 'Google UK English Female',                   
        speed VARCHAR(40) DEFAULT '1', 
        pitch VARCHAR(40) DEFAULT '1',            
        color VARCHAR(20) DEFAULT 'blue',                    
        date_registered DATETIME
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table users created")});
};

const userssettings = () => {
    const sql = `CREATE TABLE userssettings (id INT AUTO_INCREMENT PRIMARY KEY,
        userid VARCHAR(100) NOT NULL UNIQUE,
        interface VARCHAR(20) DEFAULT 'en-US',    
        my_lang VARCHAR(20) DEFAULT 'none',    
        voice VARCHAR(60) DEFAULT 'Google UK English Female',                   
        speed VARCHAR(40) DEFAULT '1', 
        pitch VARCHAR(40) DEFAULT '1',            
        color VARCHAR(20) DEFAULT 'blue'            
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table userssettings created")});
};

const wordlists = () => {
    const sql = `CREATE TABLE wordlists (id INT AUTO_INCREMENT PRIMARY KEY,
        list_name VARCHAR(100),
        userid VARCHAR(100),
        list_permission VARCHAR(10),
        date_create DATETIME,
        date_updeta DATETIME
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table wordlists created")});
};

const listssettings = () => {
    const sql = `CREATE TABLE listssettings (id INT AUTO_INCREMENT PRIMARY KEY,
        list_name VARCHAR(100),
        userid VARCHAR(100),
        list_type VARCHAR(10)
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table listssettings created")});
};


const words = () => {
    const sql = `CREATE TABLE words (id INT AUTO_INCREMENT PRIMARY KEY,
        word VARCHAR(100) NOT NULL UNIQUE,
        word_translation VARCHAR(100) NOT NULL,
        word_lang VARCHAR(10),
        created_by VARCHAR(100),
        date_create DATETIME
        )`; 
    con.query(sql, function (err, result) {if (err) throw err; console.log("Table words created")});
};

module.exports = {
    users,
    userssettings,
    wordlists,
    listssettings,
    words
};