const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) res.status(401).send('Acceso denegado.');

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex){
        res.status(400).send("Token Inválido");
    }
}

module.exports = auth;