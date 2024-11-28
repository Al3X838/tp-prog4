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
    const errorMessage = err?.odbcErrors?.[0]?.message || err.message || 'Unknown database error';
    console.error(`Error al ${action}:`, errorMessage);
    res.status(500).json({ success: false, error: `Database error while ${action}: ${errorMessage}` });
};

// Ruta para obtener todos los empleados
/*
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM EMPLEADOS ORDER BY NOMBRE');
        await connection.close();
        res.json({ success: true, empleados: result });
    } catch (err) {
        handleDbError(err, res, 'fetching empleados');
    }
});
*/
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`
            SELECT
            EMPLEADOS.EMPLEADO,
            EMPLEADOS.NOMBRE AS EMPLEADO_NOMBRE,
            EMPLEADOS.APELLIDO AS EMPLEADO_APELLIDO,
            EMPLEADOS.DIRECCION,
            EMPLEADOS.TELEFONO,
            EMPLEADOS.EMAIL,
            EMPLEADOS.SALARIO,
            EMPLEADOS.FECHA_INGRESO,
            EMPLEADOS.FECHA_SALIDA,
            AREAS.AREA AS AREA_ID,
            AREAS.NOMBRE AS AREA_NOMBRE,
            PAISES.PAIS AS PAIS_ID,
            PAISES.NOMBRE AS PAIS_NOMBRE
            FROM EMPLEADOS
            JOIN AREAS ON EMPLEADOS.AREA = AREAS.AREA
            JOIN PAISES ON EMPLEADOS.PAIS = PAISES.PAIS
            ORDER BY EMPLEADO_NOMBRE
            `);
        await connection.close();
        res.json({ success: true, empleados: result });
    } catch (err) {
        handleDbError(err, res, 'fetching empleados');
    }
});


// Ruta GET para obtener un empleado específico por su ID
router.get('/empleado/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`
            SELECT
            EMPLEADOS.EMPLEADO,
            EMPLEADOS.NOMBRE,
            EMPLEADOS.APELLIDO,
            EMPLEADOS.DIRECCION,
            EMPLEADOS.TELEFONO,
            EMPLEADOS.EMAIL,
            EMPLEADOS.FECHA_INGRESO,
            EMPLEADOS.FECHA_SALIDA,
            EMPLEADOS.SALARIO,
            AREAS.AREA AS AREA_ID,
            AREAS.NOMBRE AS AREA_NOMBRE,
            PAISES.PAIS AS PAIS_ID,
            PAISES.NOMBRE AS PAIS_NOMBRE
            FROM EMPLEADOS
            JOIN AREAS ON EMPLEADOS.AREA = AREAS.AREA
            JOIN PAISES ON EMPLEADOS.PAIS = PAISES.PAIS
            WHERE EMPLEADO = ?` , [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, empleado: result[0] });
        } else {
            res.json({ success: false, error: 'Empleado not found.' });
        }
    } catch (err) {
        handleDbError(err, res, 'fetching empleado by ID');
    }
});


// Ruta para agregar un nuevo empleado
router.post('/add', async (req, res) => {
    const { nombre, apellido, direccion, pais, telefono, email, area, fecha_ingreso, fecha_salida, salario } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(
            `INSERT INTO EMPLEADOS (NOMBRE, APELLIDO, DIRECCION, PAIS, TELEFONO, EMAIL, AREA, FECHA_INGRESO, FECHA_SALIDA, SALARIO) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, direccion, pais, telefono, email, area, fecha_ingreso, fecha_salida, salario]
        );
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'adding empleados');
    }
});

// Ruta para actualizar un empleado existente
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, direccion, pais, telefono, email, area, fecha_ingreso, fecha_salida, salario } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(
            `UPDATE EMPLEADOS SET NOMBRE = ?, APELLIDO = ?, DIRECCION = ?, PAIS = ?, TELEFONO = ?, EMAIL = ?, AREA = ?, FECHA_INGRESO = ?, FECHA_SALIDA = ?, SALARIO = ? 
             WHERE EMPLEADO = ?`,
            [nombre, apellido, direccion, pais, telefono, email, area, fecha_ingreso, fecha_salida, salario, id]
        );
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'updating empleados');
    }
});


// Ruta para eliminar un empleado
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM EMPLEADOS WHERE EMPLEADO = ?`, [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'deleting empleados');
    }
});

module.exports = router;
