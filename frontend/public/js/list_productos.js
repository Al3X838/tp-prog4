document.addEventListener('DOMContentLoaded', function () {
    const productosList = document.getElementById('productos-list'); // ID del tbody donde se mostrarán los productos

    function loadProductos() {
        fetch('/productos', { method: 'GET' }) // Solicita al servidor los productos
            .then(response => response.json())
            .then(data => {

                let productos = data.productos; // Obtiene la lista de productos
                //console.log(productos);

                if (data.success !== false) {
                    // Genera las filas de la tabla con los datos de los productos
                    productosList.innerHTML = productos.map(producto => `
                        <tr>
                            <td>${producto.PRODUCTO}</td>
                            <td>${producto.PRODUCTO_NOMBRE} </td>
                            <td>${producto.CATEGORIA_NOMBRE} (${producto.CATEGORIA})</td>
                            <td>${producto.MARCA_NOMBRE} (${producto.MARCA})</td>
                            <td>${producto.PRECIO_COSTO}</td>
                            <td>${producto.PRECIO_VENTA}</td>
                            <td>${producto.EXISTENCIA}</td>
                            <td>
                                <button class="btn btn-primary" onclick="editProducto(${producto.PRODUCTO})">Actualizar</button>
                                <button class="btn btn-danger" onclick="confirmDelete(${producto.PRODUCTO})">Eliminar</button>
                                <button class="btn btn-info" onclick="mostrarDetalles(${producto.PRODUCTO})">Ver más</button>
                            </td>
                        </tr>
                        <tr id="detalles${producto.PRODUCTO}" class="d-none bg-light">
                            <td colspan="8">
                                <div class="detalles-content p-3 border rounded shadow-sm">
                                    <p><strong>Fecha de Adquisición:</strong> ${producto.FECHA_ADQUISICION}</p>
                                    <p><strong>Garantía:</strong> ${producto.GARANTIA}</p>
                                </div>
                            </td>
                        </tr>
                    `).join(''); // Une las filas generadas en un solo bloque HTML
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al agregar el procucto.',
                        confirmButtonText: 'Aceptar'
                    });
                    
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la conexión con el servidor.',
                    confirmButtonText: 'Aceptar'
                });
                console.error('Error al cargar productos:', error);
            });
    }

    // Función para mostrar/ocultar detalles de un producto
    window.mostrarDetalles = function (id) {
        const detalles = document.getElementById(`detalles${id}`);
        if (detalles.classList.contains('d-none')) {
            detalles.classList.remove('d-none'); // Mostrar detalles
        } else {
            detalles.classList.add('d-none'); // Ocultar detalles
        }
    };

    // Función para redirigir a la página de edición de un producto
    window.editProducto = function (id) {
        window.location.href = `upd_producto.html?id=${id}`;
    };

    // Función para confirmar eliminación de un producto
    window.confirmDelete = function (id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProducto(id, loadProductos); // Llama a la función que elimina el producto
            }
        });
        
    };

    // Función para eliminar un producto
    function deleteProducto(id, callback) {
        fetch(`/productos/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback(); // Recarga la lista de productos
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al eliminar el proveedor.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text:'Error de la base de datos.',
                        confirmButtonText: 'Aceptar'
                    });
                console.error('Error al eliminar producto:', error);
            });
    }

    loadProductos(); // Carga la lista de productos al iniciar la página
});
