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

// Ruta para obtener todos los proveedores

router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM PROVEEDORES ORDER BY NOMBRE');
        await connection.close();
        res.json({ success: true, proveedores: result });
    } catch (err) {
        handleDbError(err, res, 'fetching proveedores');
    }
});

router.get('/proveedor/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM PROVEEDORES WHERE PROVEEDOR = ?`, [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, proveedor: result[0] });
        } else {
            res.json({ success: false, error: 'Proveedor not found.' });
        }
    } catch (err) {
        handleDbError(err, res, 'fetching proveedor by ID');
    }
});
// agregar proveedor
router.post('/add', async (req, res) => {
    const { nombre, direccion, pais, telefono, email, fecha_inicio} = req.body;
    try {
        const connection = await getConnection();
        await connection.query(
            `INSERT INTO PROVEEDORES (NOMBRE, DIRECCION, PAIS, TELEFONO, EMAIL, FECHA_INICIO) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, direccion, pais, telefono, email, fecha_inicio]
        );
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'adding proveedores');
    }
});

router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, pais, telefono, email, fecha_inicio } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`
            UPDATE PROVEEDORES SET NOMBRE = ?, DIRECCION = ?, PAIS = ?, TELEFONO = ?, EMAIL = ?, FECHA_INICIO = ?
            WHERE PROVEEDOR = ?`,
            [nombre, direccion, pais, telefono, email, fecha_inicio, id]
        );
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'updating proveedor');
    }
});


router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM PROVEEDORES WHERE PROVEEDOR = ?`, [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'eliminar proveedores');
    }
});

module.exports = router;