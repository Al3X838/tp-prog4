const express = require('express');
const path = require('path');

// Importa los microservicios
const connectRouter = require('./routes/connect'); // Ruta para conexión
const areasRouter = require('./routes/areas'); // Ruta para áreas
const empleadosRouter = require('./routes/empleados');  // Ruta para empleados
const paisesRouter = require('./routes/paises');  // Ruta para países
const categoriasRouter = require('./routes/categorias');  
const marcasRouter = require('./routes/marcas');
const proveedoresRouter = require('./routes/proveedores'); 
const productosRouter = require('./routes/productos'); 
const comprasRouter = require('./routes/compras');
const ajustesRouter = require('./routes/ajustes'); 
const autenticarToken = require('./routes/autenticacion'); 


const app = express();
const PORT = 3000;

app.use(express.json());



// Sirve archivos estáticos desde la carpeta frontend/public
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rutas de frontend (corrigiendo nombres)
app.get('/home', autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/login.html'));
});

app.get('/list_areas', autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_areas.html'));
});

app.get('/add_area',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_area.html'));
});

app.get('/upd_area',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_area.html'));
});

app.get('/list_empleados',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_empleados.html'));
});

app.get('/add_empleado',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_empleado.html'));
});

app.get('/upd_empleado',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_empleado.html'));
});

app.get('/list_paises',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_paises.html'));
});

app.get('/add_pais',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_pais.html'));
});

app.get('/upd_pais',autenticarToken, (req, res) => { 
    res.sendFile(path.join(__dirname, '../frontend/public/upd_pais.html'));
});

app.get('/list_categorias',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_categorias.html'));
});

app.get('/add_categoria',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_categoria.html'));
});

app.get('/upd_categoria',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_categoria.html'));
});

app.get('/list_marcas',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_marcas.html'));
});

app.get('/add_marca',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_marca.html'));
});

app.get('/upd_marca',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_marca.html'));
});

app.get('/list_proveedores',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_proveedores.html'));
});
app.get('/add_proveedor',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_proveedor.html'));
});
app.get('/upd_proveedor',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_proveedor.html'));
});

app.get('/list_productos',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_productos.html'));
});

app.get('/add_producto',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_producto.html'));
});

app.get('/upd_producto',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_producto.html'));
});

app.get('/list_compras',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_compras.html'));
});

app.get('/add_compra',autenticarToken, (req, res) =>{
    res.sendFile(path.join(__dirname, '../frontend/public/add_compra.html'));
});

app.get('/upd_compra',autenticarToken, (req, res) =>{
    res.sendFile(path.join(__dirname, '../frontend/public/upd_compra.html'));
});

app.get('/list_ajustes',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_ajustes.html'));
});

app.get('/add_ajuste',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_ajuste.html'));
});

app.get('/upd_ajuste',autenticarToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_ajuste.html'));
});



// Rutas de microservicios
app.use('/connect', connectRouter);
app.use('/areas', areasRouter);
app.use('/empleados', empleadosRouter); // Ruta para empleados
app.use('/paises', paisesRouter); // Ruta para países
app.use('/categorias', categoriasRouter); // Ruta para países
app.use('/marcas', marcasRouter);
app.use('/proveedores', proveedoresRouter);
app.use('/productos', productosRouter);
app.use('/compras', comprasRouter);
app.use('/ajustes', ajustesRouter);



// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}/login.html`);
});
