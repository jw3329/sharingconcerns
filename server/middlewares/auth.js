const redisClient = require('../redis');

module.exports = async (req, res, next) => {
    const { user } = req.session;
    if (!user) {
        const redisUser = JSON.parse(await redisClient.getAsync('user'));
        console.log(redisUser)
        if (redisUser) req.session.user = redisUser;
        else return res.status(401).json({ message: 'User is not authorized' });
    }
    next();
};