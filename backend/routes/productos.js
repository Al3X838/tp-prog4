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

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`
            SELECT 
                p.PRODUCTO,
                p.NOMBRE AS PRODUCTO_NOMBRE,
                p.CATEGORIA,
                c.NOMBRE AS CATEGORIA_NOMBRE,
                p.MARCA,
                m.NOMBRE AS MARCA_NOMBRE,
                p.PRECIO_COSTO,
                p.PRECIO_VENTA,
                p.EXISTENCIA,
                p.FECHA_ADQUISICION,
                p.GARANTIA
            FROM 
                PRODUCTOS p
            LEFT JOIN 
                CATEGORIAS c ON p.CATEGORIA = c.CATEGORIA
            LEFT JOIN 
                MARCAS m ON p.MARCA = m.MARCA
            ORDER BY 
                p.NOMBRE;`);
        await connection.close();
        res.json({ success: true, productos: result });
    } catch (err) {
        handleDbError(err, res, 'fetching productos');
    }
});

// Ruta GET para obtener un producto específico por su ID
router.get('/producto/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM PRODUCTOS WHERE PRODUCTO = ?', [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, producto: result[0] });
        } else {
            res.json({ success: false, error: 'Producto no encontrado.' });
        }
    } catch (err) {
        handleDbError(err, res, 'fetching producto by ID');
    }
});

// Ruta para agregar un nuevo producto
router.post('/add', async (req, res) => {
    const {
        nombre,
        categoria,
        marca,
        garantia
    } = req.body;

    try {
        const connection = await getConnection();
        await connection.query(`
            INSERT INTO PRODUCTOS (NOMBRE, CATEGORIA, MARCA, GARANTIA) 
            VALUES (?, ?, ?, ?,)`,
            [nombre, categoria, marca, garantia]
        );
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'adding producto');
    }
});

// Ruta para actualizar un producto existente
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        categoria,
        marca,
        garantia
    } = req.body;

    try {
        const connection = await getConnection();
        await connection.query(`
            UPDATE PRODUCTOS 
            SET NOMBRE = ?, CATEGORIA = ?, MARCA = ?, GARANTIA = ?
            WHERE PRODUCTO = ?`,
            [nombre, categoria, marca, garantia, id]
        );
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'updating producto');
    }
});

// Ruta para eliminar un producto
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query('DELETE FROM PRODUCTOS WHERE PRODUCTO = ?', [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'eliminar un producto');
    }
});

module.exports = router;
