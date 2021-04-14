const {log} = require('./service');

const renderMain = (req, res, err) => {
    res.render(`main`, {
        userId : "userId"
    });
}

const renderSettings = (req, res, err) => {
    res.render(`settings`, {
        userId : "userId"
    });
}

const renderFriends = (req, res, err) => {
    res.render(`friends`, {
        userId : "userId"
    });
}

const renderPage = (req, res, pageName = 'main', err = '') => {
    if (err !== '') {
        log("SERVER ERROR:", err);
        res.render(pageName, {
            errMessage : `SERVER ERROR: ${err}`
        });
        // res.redirect('/');

        
    }; 

    res.render(pageName, {
        userId : "userId",
        errMessage : ''
    });
}



module.exports = {
    renderPage,
    renderMain,
    renderSettings,
    renderFriends
};