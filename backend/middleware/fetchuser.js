var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Samirisagoodb$oy'
const fetchuser = (req, res, next) => {
    // At the end we will call next
    // Get the user from the jwt token and add id to request object  
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}

module.exports = fetchuser;
