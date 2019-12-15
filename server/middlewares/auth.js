module.exports = (req, res, next) => {
    const { user } = req.session;
    if (!user) {
        return res.status(401).json({ message: 'User is not authorized' });
    }
    next();
};