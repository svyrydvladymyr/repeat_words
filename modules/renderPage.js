const renderPage = (req, res, err) => {
    res.render(`main`, {
        userId : "userId"
    });
}

module.exports = {
    renderPage
};