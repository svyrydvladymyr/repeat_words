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

module.exports = {
    renderMain,
    renderSettings
};