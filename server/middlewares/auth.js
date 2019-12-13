module.exports = (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
        return res.status(401).send('No user found');
    }
    next();
};