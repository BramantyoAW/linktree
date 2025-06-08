const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'fallback_secret';


function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({
        error: 'No Token '
    })
    
    try {
        console.log('masok pak eko');
        
        const decoded = jwt.verify(token, SECRET)
        console.log('masok pak eko 1');
        req.userId = decoded.id
        console.log('masok pak eko 2');

        next()
    } catch (error) {
        res.status(403).json({
            error: 'Invalid Token'
        })
    }
}

function signToken(payload) {
    console.log(payload)
    return jwt.sign(payload, SECRET, { expiresIn: '1d'})
}

module.exports = {auth, signToken}