module.exports = (req, res, next) => {
    const { user } = req.session;
    if (!user) {
        return res.status(401).send('No user found');
    }
    next();
};