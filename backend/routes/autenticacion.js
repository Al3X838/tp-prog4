const jwt = require('jsonwebtoken'); // libreria para generar tokens
const claveMegaSecreta = 'lechuga';

function autenticarToken(req, res, next) { // middleware
    const authHeader = req.headers['Authorization']; // Authorization deberia tener el token
    const token = authHeader && authHeader.split(' ')[1]; //obtiene el token del encabezado

    if (!token) {
        return res.status(401).send("ndaipori token");
    }
    
    jwt.verify(token, claveMegaSecreta, (err, user) => { // verify verifica(🤯) si el token es valido
        if (err) {
            return res.status(403).send("Token invalido o expirado");
        }

        console.log("token valido", user);
        req.user = user; 
        next();
    });
}

module.exports = autenticarToken;
