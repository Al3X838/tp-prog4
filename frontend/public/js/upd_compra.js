document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-compra-form');
    const urlParams = new URLSearchParams(window.location.search);
    const compraId = urlParams.get('id');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


    // Método para cargar la lista de países
    const loadProductos = () => {
        fetch('/productos/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const productoSelect = document.getElementById('producto');

                    
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Selecciona un producto';
                    defaultOption.selected = true;
                    defaultOption.disabled = true;
                    productoSelect.appendChild(defaultOption);
                    

                    data.productos.forEach(producto => {
                        const option = document.createElement('option');
                        option.value = producto.PRODUCTO;
                        option.textContent = producto.PRODUCTO_NOMBRE + '(' + producto.PRODUCTO + ')';
                        productoSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la lista de prouctos.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para cargar la lista de productos.',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    const loadEmpleados = () => {
        fetch('/empleados/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const empleadoSelect = document.getElementById('empleado');

                    data.empleados.forEach(empleado => {
                        const option = document.createElement('option');
                        option.value = empleado.EMPLEADO;
                        option.textContent = empleado.EMPLEADO_NOMBRE + '(' + empleado.EMPLEADO + ')';
                        empleadoSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la lista de empleados.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar empleados:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para cargar la lista de empelados.',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    const loadProveedor = () => {
        fetch('/proveedores/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const proveedorSelect = document.getElementById('proveedor');

                    // Add default option
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Selecciona un proveedor';
                    defaultOption.selected = true;
                    defaultOption.disabled = true;
                    proveedorSelect.appendChild(defaultOption);

                    data.proveedores.forEach(proveedor => {
                        const option = document.createElement('option');
                        option.value = proveedor.PROVEEDOR;
                        option.textContent = proveedor.NOMBRE + '(' + proveedor.PROVEEDOR + ')';
                        proveedorSelect.appendChild(option);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la lista de proveedores.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar proveedores:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para cargar la lista de proveedores.',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    loadEmpleados();
    loadProductos();
    loadProveedor();
    //Promise.all([loadProductos(), loadEmpleados(), loadProveedor()])
    //.then(  () => {
    if (compraId) {
        fetch(`/compras/compra/${compraId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.compra) {
                    
                    document.getElementById('producto').value = data.compra.PRODUCTO_ID;
                    document.getElementById('fecha_compra').value = data.compra.FECHA;
                    document.getElementById('proveedor').value = data.compra.PROVEEDOR_ID;
                    document.getElementById('empleado').value = data.compra.EMPLEADO_ID;
                    document.getElementById('cantidad').value = data.compra.CANTIDAD;
                    document.getElementById('precio_compra').value = data.compra.PRECIO_COSTO;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al cargar la compra.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener datos de la compra.'
                });
                console.error('Error:', error);
            });
    }
//});

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const updatedCompraData = {
            producto: document.getElementById('producto').value,
            fecha: document.getElementById('fecha_compra').value,
            proveedor: document.getElementById('proveedor').value,
            empleado: document.getElementById('empleado').value,
            cantidad: document.getElementById('cantidad').value,
            precio_costo: document.getElementById('precio_compra').value
        };
        
        fetch(`/compras/update/${compraId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCompraData)
        })
        
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualizado!',
                        text: 'La compra se ha actualizado correctamente.',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        history.go(-1);
                    history.replaceState(null, '', '/list_compras.html'); // Cambiar la URL actual a /list_area
                    history.replaceState(null, '', '/home.html'); 
                    setTimeout(() => {
                        location.reload(); // Asegura que la página se recargue
                    }, 100);
                    window.location.href = '/list_compras.html'; // Redirige tras el éxito
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al actualizar la compra.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la conexión con el servidor.'
                });
                console.error('Error al actualizar empleado:', error);
            });
    });


    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_compras.html'; // Regresa a la página anterior
    });

});