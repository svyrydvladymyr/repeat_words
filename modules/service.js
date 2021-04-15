const transliteration = require('transliteration.cyr');
const Cookies = require('cookies');
const con = require('../db/connectToDB').con;
const pageNotFound = `<p style="text-align: center; color: red; margin: 100px auto; font: bold 16px Arial;">PAGE NOT FOUND!!!</p>`;
const fs = require('fs');

//transliteration
const translit = word => {return transliteratedValue = transliteration.transliterate(word)};

//client token
const clienttoken = (req, res) => new Cookies(req, res, {"keys":['volodymyr']}).get('sessionisdd', {signed:true});

//generate token
const token = length => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {result += characters.charAt(Math.floor(Math.random() * characters.length))}
    return result;
};

//consoleLog message
const log = (mess, val, arrow = '') => {
    for (let i = 0; i < 25 - mess.length; i++){ arrow += '-' };
    console.log(`--${mess}${arrow}>> `, val);   
};

//date format minutes
const readyMin = function(fullDate){
    const createDate = new Date(fullDate);
    return finDay = ((createDate.getMinutes() >= 1) && (createDate.getMinutes() <= 9)) ? "0" + createDate.getMinutes() : createDate.getMinutes();
};  

//date format day
const readyDay = function(fullDate){
    const createDate = new Date(fullDate);
    return finDay = ((createDate.getDate() >= 1) && (createDate.getDate() <= 9)) ? "0" + createDate.getDate() : createDate.getDate();
};  

//date format month
const readyMonth = function(fullDate){    
    const createDate = new Date(fullDate);
    return finMonth = ((createDate.getMonth() >= 0) && (createDate.getMonth() <= 8)) 
        ? "0" + (createDate.getMonth()+1) 
        : (createDate.getMonth() == 9) ? 10 
        : (createDate.getMonth() == 10) ? 11
        : (createDate.getMonth() == 11) ? 12 : null;          
}; 

//ready full date
const readyFullDate = (fullDate, reverse) => {
    const dateRegFull = new Date(fullDate);
    const dateRegFullEmpty = new Date();
    if (reverse === 'reverse'){
        return dateReg = ((fullDate === '') || (fullDate === undefined)) 
            ? dateRegFullEmpty.getHours() + ":" + readyMin(dateRegFullEmpty) + " " + readyDay(dateRegFullEmpty) + "-" + readyMonth(dateRegFullEmpty) + "-" + dateRegFullEmpty.getFullYear() 
            : dateRegFull.getHours() + ":" + readyMin(dateRegFull) + " " + readyDay(dateRegFull) + "-" + readyMonth(dateRegFull) + "-" + dateRegFull.getFullYear();
    } else {
        return dateReg = ((fullDate === '') || (fullDate === undefined))
            ? dateRegFullEmpty.getHours() + ":" + readyMin(dateRegFullEmpty) + " " + dateRegFullEmpty.getFullYear() + "-" + readyMonth(dateRegFullEmpty) + "-" + readyDay(dateRegFullEmpty)
            : dateRegFull.getHours() + ":" + readyMin(dateRegFull) + " " + dateRegFull.getFullYear() + "-" + readyMonth(dateRegFull) + "-" + readyDay(dateRegFull);
    };
};

//chack on true values
let checOnTrueVal = (el) => {
    let reg = "[^a-zA-Zа-яА-Я0-9-()_+=.'\":/\,іІїЇєЄ /\n]";
    let newReg = new RegExp(reg, "gi");    
    let res = el.replace(newReg, '');
    return res;    
}

//save logs
let accessLog = (req, res, next) => {
    let logs = `IP: ${req.ip}  TIME: ${new Date().toLocaleString()}  URL: ${req.url}\n`;
    let namefile = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    fs.appendFile(`./log/${namefile}.txt`, logs, (err) => {if (err) {console.log(err)}});
    next();
}


module.exports = {
    pageNotFound,
    translit,
    token,
    log,
    clienttoken,
    readyFullDate,
    checOnTrueVal,
    accessLog
}