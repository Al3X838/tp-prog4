// connect.js - Microservicio para conexión a la base de datos

const express = require('express'); // maneja las rutas y las peticiones del http
const odbc = require('odbc'); // modulo para conectar y manejar la base de datos
const router = express.Router(); // una instacia de Router que agrupa todas las rutas

const jwt = require('jsonwebtoken');



// Variables globales para almacenar las credenciales de forma temporal
// no es muy recomendable que digamos
global.dbUser = '';
global.dbPassword = '';
const claveMegaSecreta = 'global.dbPassword';

// Ruta POST para conectar a la base de datos
router.post('/', async (req, res) => { // define una ruta POST en el endpoint
    const { username, password } = req.body; // req.body captura el usuario y la contrasena que se envian como solicitud
    
    if (!username || !password) {
        return res.status(400).send("usuario y contrasena requeridos");
    }
    
    try {
        
        global.dbUser = username;
        global.dbPassword = password;

        // UID y PWD reemplaza los valores username y password por los proporcionados
        const connection = await odbc.connect(`DSN=prog4;UID=${username};PWD=${password}`);
        await connection.close();

        const token = jwt.sign({ username }, claveMegaSecreta, { expiresIn: '3h' });
        res.status(200).json({ token });

        //res.status(200).send("Conexión exitosa");
    } catch (error) {
        res.status(500).send("Error de conexión");
    }
});

module.exports = router; // permite usar este modulo en app.js