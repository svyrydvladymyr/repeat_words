module.exports = (req, res, pageName, err = '') => {
    const DATA = require('./user').DATA;
    require('./user').clearDATA();
    if (err !== '') {        
        DATA.errors.SERVER_ERROR = 'SERVER ERROR: 500 (Internal Server Error)';
        console.log('SERVER ERROR:', err);
        res.status(500).render('main', { DATA });
    } else {
        require('./user').getUser(req, res, pageName)
        // .then(() => { console.log("DATA", DATA) })
        .then(() => { res.render(pageName, { DATA }) });
    };
};