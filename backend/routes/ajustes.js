const express = require('express');
const router = express.Router();
const odbc = require('odbc');

// Obtener conexión a la base de datos
const getConnection = async () => {
    try {
        const connection = await odbc.connect(`DSN=prog4;UID=${global.dbUser};PWD=${global.dbPassword}`);
        return connection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw new Error('Database connection error');
    }
};

const handleDbError = (err, res, action) => {
    let errorMessage = err?.odbcErrors?.[0]?.message || err.message || 'Unknown database error';
    if (errorMessage.includes("is referenced by foreign key")) {
        
        errorMessage = "No se puede realizar la operación porque el registro está relacionado con otros datos.";
    }
    console.error(`Error al ${action}:`, errorMessage);
    res.status(500).json({ success: false, error: `Error al ${action}: ${errorMessage}` });
};

// Obtener todos los ajustes
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`
            SELECT 
                AJUSTES.AJUSTE,
                AJUSTES.FECHA,
                AJUSTES.TIPO_AJUSTE,
                AJUSTES.CANTIDAD,
                AJUSTES.PRECIO_COSTO,
                PRODUCTOS.PRODUCTO AS PRODUCTO_ID,
                PRODUCTOS.NOMBRE AS PRODUCTO_NOMBRE,
                AJUSTES.EMPLEADO AS EMPLEADO_ID,
                EMPLEADOS.NOMBRE AS EMPLEADO_NOMBRE,
                EMPLEADOS.APELLIDO AS EMPLEADO_APELLIDO
            FROM AJUSTES
            JOIN PRODUCTOS ON AJUSTES.PRODUCTO = PRODUCTOS.PRODUCTO
            JOIN EMPLEADOS ON AJUSTES.EMPLEADO = EMPLEADOS.EMPLEADO
            ORDER BY AJUSTES.FECHA DESC
        `);
        await connection.close();
        res.json({ success: true, ajustes: result });
    } catch (err) {
        handleDbError(err, res, 'fetching ajustes');
    }
});

router.get('/ajuste/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`
            SELECT
                AJUSTES.AJUSTE,
                AJUSTES.FECHA,
                AJUSTES.TIPO_AJUSTE,
                AJUSTES.CANTIDAD,
                AJUSTES.PRECIO_COSTO,
                PRODUCTOS.PRODUCTO AS PRODUCTO_ID,
                PRODUCTOS.NOMBRE AS PRODUCTO_NOMBRE,
                AJUSTES.EMPLEADO AS EMPLEADO_ID,
                EMPLEADOS.NOMBRE AS EMPLEADO_NOMBRE,
                EMPLEADOS.APELLIDO AS EMPLEADO_APELLIDO
            FROM AJUSTES
            JOIN PRODUCTOS ON AJUSTES.PRODUCTO = PRODUCTOS.PRODUCTO
            JOIN EMPLEADOS ON AJUSTES.EMPLEADO = EMPLEADOS.EMPLEADO
            WHERE AJUSTE = ?`, [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, ajuste: result[0] });
        } else {
            res.json({ success: false, error: 'Ajuste not found.' });
        }
    } catch (err) {
        handleDbError(err, res, 'fetching ajuste by ID');
    }
});



// Agregar un ajuste
router.post('/add', async (req, res) => {
    const { producto, empleado, fecha, tipo_ajuste, cantidad, precio_costo } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`
            INSERT INTO AJUSTES (PRODUCTO, EMPLEADO, FECHA, TIPO_AJUSTE, CANTIDAD, PRECIO_COSTO)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [producto, empleado, fecha, tipo_ajuste, cantidad, precio_costo]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'adding ajustes');
    }
});

// Actualizar un ajuste
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { producto, empleado, fecha, tipo_ajuste, cantidad, precio_costo } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`
            UPDATE AJUSTES 
            SET PRODUCTO = ?, EMPLEADO = ?, FECHA = ?, TIPO_AJUSTE = ?, CANTIDAD = ?, PRECIO_COSTO = ?
            WHERE AJUSTE = ?
        `, [producto, empleado, fecha, tipo_ajuste, cantidad, precio_costo, id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'updating ajustes');
    }
});

// Eliminar un ajuste
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM AJUSTES WHERE AJUSTE = ?`, [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'eliminar ajustes');
    }
});

module.exports = router;
