const {autorisationCheck, getTableRecord, log} = require('./service');

module.exports = async (req, res) => {
    const word = req.body.word;
    let userLlang = 'en-US';
    console.log(word);


    autorisationCheck(req, res)
    .then((user) => {
        if (user === false) { throw new Error('error-autorisation') };
        userLlang = user.my_lang;
        return `SELECT * FROM words WHERE word_lang = '${user.my_lang}' && (word = '${word}' || word_translation = '${word}')`;
    })
    .then(await getTableRecord)
    .then((word) => {  

        console.log('word', word);

        if (word.err) { throw new Error(word.err) }; 
        if (word == '') { 
            res.send({"NO":"<div class='add-word-btn-wrap'><b>Такого слова в нашому переліку немає! Ви можете його добавити!</b><button><i class='fas fa-plus'></i></button></div>"}); 
        }; 
        if (word != '') {
            res.send({"words": word}); 
        }


    })
    .catch((err) => {
        log('words-error', err);
        res.status(500).send('SERVER ERROR: 500 (Internal Server Error)');
    });
};