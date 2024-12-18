const express = require('express');
const router = express.Router();
const odbc = require('odbc');

// Función para obtener la conexión a la base de datos
const getConnection = async () => {
    try {
        const connection = await odbc.connect(`DSN=prog4;UID=${global.dbUser};PWD=${global.dbPassword}`);
        return connection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw new Error('Database connection error');
    }
};

// Función para manejo de errores de base de datos
// *** MODIFICACIÓN ***
const handleDbError = (err, res, action) => {
    let errorMessage = err?.odbcErrors?.[0]?.message || err.message || 'Unknown database error';
    if (errorMessage.includes("is referenced by foreign key")) {
        
        errorMessage = "No se puede realizar la operación porque el registro está relacionado con otros datos.";
    }
    console.error(`Error al ${action}:`, errorMessage);
    res.status(500).json({ success: false, error: `Error al ${action}: ${errorMessage}` });
};

// Ruta para obtener todas las áreas
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM CATEGORIAS ORDER BY NOMBRE');
        await connection.close();
        res.json({ success: true, categorias: result });
    } catch (err) {
        handleDbError(err, res, 'fetching categorias');  // *** MODIFICACIÓN ***
    }
});

// Ruta GET para obtener un área específica por su ID
router.get('/categoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM CATEGORIAS WHERE CATEGORIA = ?`, [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, categoria: result[0] });
        } else {
            res.json({ success: false, error: 'Categoria not found.' });
        }
    } catch (err) {
        handleDbError(err, res, 'fetching categoria by ID');  // *** MODIFICACIÓN ***
    }
});

// Ruta para agregar una nueva área
router.post('/add', async (req, res) => {
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`INSERT INTO CATEGORIAS (NOMBRE) VALUES (?)`, [nombre]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'adding categoria');  // *** MODIFICACIÓN ***
    }
});

// Ruta para actualizar un área existente
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`UPDATE CATEGORIAS SET NOMBRE = ? WHERE CATEGORIA = ?`, [nombre, id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'updating categoria');  // *** MODIFICACIÓN ***
    }
});

// Ruta para eliminar un área
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM CATEGORIAS WHERE CATEGORIA  = ?`, [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'eliminar la categoria');  // *** MODIFICACIÓN ***
    }
});

module.exports = router;


