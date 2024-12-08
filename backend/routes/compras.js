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
    let errorMessage = err?.odbcErrors?.[0]?.message || err.message || 'Unknown database error';
    if (errorMessage.includes("is referenced by foreign key")) {
        
        errorMessage = "No se puede realizar la operación porque el registro está relacionado con otros datos.";
    }
    console.error(`Error al ${action}:`, errorMessage);
    res.status(500).json({ success: false, error: `Error al ${action}: ${errorMessage}` });
};

// Obtener todas las compras
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT
            COMPRAS.COMPRA,
            COMPRAS.PRODUCTO AS PRODUCTO_ID,
            PRODUCTOS.NOMBRE AS PRODUCTO_NOMBRE,
            COMPRAS.EMPLEADO AS EMPLEADO_ID,
            EMPLEADOS.NOMBRE AS EMPLEADO_NOMBRE,
            COMPRAS.FECHA,
            COMPRAS.PROVEEDOR AS PROVEEDOR_ID,
            PROVEEDORES.NOMBRE AS PROVEEDOR_NOMBRE,
            COMPRAS.CANTIDAD,
            COMPRAS.PRECIO_COSTO
            FROM COMPRAS
            JOIN PRODUCTOS ON COMPRAS.PRODUCTO = PRODUCTOS.PRODUCTO
            JOIN EMPLEADOS ON COMPRAS.EMPLEADO = EMPLEADOS.EMPLEADO
            JOIN PROVEEDORES ON COMPRAS.PROVEEDOR = PROVEEDORES.PROVEEDOR
            ORDER BY FECHA;
            `);
        await connection.close();
        res.json({ success: true, compras: result });
    } catch (err) {
        handleDbError(err, res, 'fetching compras');
    }
});

// Obtener una compra por ID
router.get('/compra/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT
            COMPRAS.COMPRA,
            COMPRAS.PRODUCTO AS PRODUCTO_ID,
            PRODUCTOS.NOMBRE AS PRODUCTO_NOMBRE,
            COMPRAS.EMPLEADO AS EMPLEADO_ID,
            EMPLEADOS.NOMBRE AS EMPLEADO_NOMBRE,
            COMPRAS.FECHA,
            COMPRAS.CANTIDAD,
            COMPRAS.PRECIO_COSTO,
            COMPRAS.PROVEEDOR AS PROVEEDOR_ID,
            PROVEEDORES.NOMBRE AS PROVEEDOR_NOMBRE
            FROM COMPRAS
            JOIN PRODUCTOS ON COMPRAS.PRODUCTO = PRODUCTOS.PRODUCTO
            JOIN EMPLEADOS ON COMPRAS.EMPLEADO = EMPLEADOS.EMPLEADO
            JOIN PROVEEDORES ON COMPRAS.PROVEEDOR = PROVEEDORES.PROVEEDOR
            WHERE COMPRA = ?`, [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, compra: result[0] });
        } else {
            res.json({ success: false, error: 'Compra not found.' });
        }
    } catch (err) {
        handleDbError(err, res, 'fetching compra by ID');
    }
});

// Agregar una compra
router.post('/add', async (req, res) => {
    const { producto, empleado, proveedor, fecha, cantidad, precio_costo } = req.body;
    try {
        const connection = await getConnection();
        
        await connection.query(
            `INSERT INTO COMPRAS (PRODUCTO, EMPLEADO, PROVEEDOR, FECHA, CANTIDAD, PRECIO_COSTO)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [producto, empleado, proveedor, fecha, cantidad, precio_costo]
        );
        await connection.close();
        res.json({ success: true});
    } catch (err) {
        handleDbError(err, res, 'adding compra');
    }
});

// Actualizar una compra
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { producto, empleado, proveedor, fecha, cantidad, precio_costo } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(
            `UPDATE COMPRAS 
             SET PRODUCTO = ?, EMPLEADO = ?, PROVEEDOR = ?, FECHA = ?, CANTIDAD = ?, PRECIO_COSTO = ?
             WHERE COMPRA = ?`,
            [producto, empleado, proveedor, fecha, cantidad, precio_costo, id]
        );
        await connection.close();
        res.json({ success: true, message: 'Compra actualizada con éxito' });
    } catch (err) {
        handleDbError(err, res, 'updating compra');
    }
});

// Eliminar una compra
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query('DELETE FROM COMPRAS WHERE COMPRA = ?', [id]);
        await connection.close();
        res.json({ success: true, message: 'Compra eliminada con éxito' });
    } catch (err) {
        handleDbError(err, res, 'eliminar una compra');
    }
});

module.exports = router;
