const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //from the front end we'll put the token in every request as a bearer token. the grab it from here
    const token = req.get('Authorization');
    if (!token) {
        req.isAuth = false;
        return next()
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'checking0my2SecretKey234');
    } catch(error) {
        console.log(error);
        req.isAuth = false
        return next()
    }
    if (!decodedToken) {
        req.isAuth = false;
        const error = new Error('Authentication failed!');
        error.code = 401;
        error.message = 'Decoding token failed!';
        throw error
    }
    req.userId = decodedToken?._id
    req.isAuth = true;
    next()
}