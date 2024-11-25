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
const handleDbError = (err, res, action) => {
    const errorMessage = err?.odbcErrors?.[0]?.message || err.message || 'Unknown database error';
    console.error(`Error al ${action}:`, errorMessage);
    res.status(500).json({ success: false, error: `Database error while ${action}: ${errorMessage}` });
};

// Ruta para obtener todas las marcas
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM MARCAS ORDER BY NOMBRE');
        await connection.close();
        res.json({ success: true, marcas: result });
    } catch (err) {
        handleDbError(err, res, 'fetching marcas');
    }
});

// Ruta GET para obtener una marca específica por su ID
router.get('/marca/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM MARCAS WHERE MARCA = ?`, [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, marca: result[0] });
        } else {
            res.json({ success: false, error: 'Marca not found.' });
        }
    } catch (err) {
        handleDbError(err, res, 'fetching marca by ID');
    }
});

// Ruta para agregar una nueva marca
router.post('/add', async (req, res) => {
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`INSERT INTO MARCAS (NOMBRE) VALUES (?)`, [nombre]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'adding marca');
    }
});

// Ruta para actualizar una marca existente
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`UPDATE MARCAS SET NOMBRE = ? WHERE MARCA = ?`, [nombre, id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'updating marca');
    }
});

// Ruta para eliminar una marca
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM MARCAS WHERE MARCA = ?`, [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'deleting marca');
    }
});

module.exports = router;
