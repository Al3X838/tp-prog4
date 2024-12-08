document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-compra-form');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


    const loadProductos = () => {
        fetch('/productos/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const productoSelect = document.getElementById('producto');

                    // Add default option
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

    const loadEmpleado = () => {
        fetch('/empleados/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const empleadoSelect = document.getElementById('empleado');

                    // Add default option
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Selecciona un empleado';
                    defaultOption.selected = true;
                    defaultOption.disabled = true;
                    empleadoSelect.appendChild(defaultOption);

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

    loadEmpleado();
    loadProductos();
    loadProveedor();

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const compraData = {
            producto: document.getElementById('producto').value,
            empleado: document.getElementById('empleado').value,
            proveedor: document.getElementById('proveedor').value,
            fecha: document.getElementById('fecha_compra').value,
            cantidad: document.getElementById('cantidad').value,
            precio_costo: document.getElementById('precio_compra').value
        };

        console.log(compraData);
        console.log("Tipo de producto:", typeof compraData.producto);
        console.log("Tipo de empleado:", typeof compraData.empleado);
        console.log("Tipo de proveedor:", typeof compraData.proveedor);
        console.log("Tipo de fecha:", typeof compraData.fecha);
        console.log("Tipo de cantidad:", typeof compraData.cantidad);
        console.log("Tipo de precio:", typeof compraData.precio);


        fetch('/compras/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(compraData)
        })

            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Compra agregada',
                        text: 'La compra se ha agregado correctamente.',
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
                        text: data.error || 'Error al agregar el empleado.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al registrar la compra:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para registrar la compra.',
                    confirmButtonText: 'Aceptar'
                });
            });
    });

    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_compras.html'; // Regresa a la página anterior
    });

});