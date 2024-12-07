document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-ajuste-form');
    const urlParams = new URLSearchParams(window.location.search);
    const ajusteId = urlParams.get('id');
    

    // Cargar lista de productos
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

    // Cargar lista de empleados
    const loadEmpleados = () => {
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
                    option.textContent = empleado.EMPLEADO_NOMBRE + ' ' + empleado.EMPLEADO_APELLIDO + '(' + empleado.EMPLEADO + ')';
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


    //loadProductos();
    //loadEmpleados();
    // Cargar datos del ajuste actual
    Promise.all([loadProductos(), loadEmpleados()])
    .then(() => {
    if (ajusteId) {
        fetch(`/ajustes/ajuste/${ajusteId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.ajuste) {
                    
                    //productoSelect.value = ajuste.PRODUCTO;
                    document.getElementById('empleado').value = data.ajuste.EMPLEADO_ID;
                    document.getElementById('producto').value = data.ajuste.PRODUCTO_ID;
                    document.getElementById('fecha').value = data.ajuste.FECHA;
                    document.getElementById('tipo_ajuste').value = data.ajuste.TIPO_AJUSTE;
                    document.getElementById('cantidad').value = data.ajuste.CANTIDAD;
                    document.getElementById('precio_costo').value = data.ajuste.PRECIO_COSTO;
                    //console.log(data.ajuste.EMPLEADO_ID);
                    
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ajuste no encontrado.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar el ajuste.',
                });
                console.error('Error al cargar ajuste:', error);
            });
    }
});

    // Manejar el envío del formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const updatedAjusteData = {
            producto: document.getElementById('producto').value,
            empleado: document.getElementById('empleado').value,
            fecha: document.getElementById('fecha').value,
            tipo_ajuste: document.getElementById('tipo_ajuste').value,
            cantidad: document.getElementById('cantidad').value,
            precio_costo: document.getElementById('precio_costo').value
        };
        console.log(updatedAjusteData);
        

        fetch(`/ajustes/update/${ajusteId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAjusteData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualizado!',
                        text: 'El ajuste ha sido actualizado correctamente.',
                    }).then(() => {
                        window.location.href = '/list_ajustes.html';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'Error al actualizar el ajuste.',
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la conexión con el servidor.',
                });
                console.error('Error al actualizar ajuste:', error);
            });
    });

    
});
