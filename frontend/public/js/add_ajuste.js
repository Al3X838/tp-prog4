document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-ajuste-form');
    const productoSelect = document.getElementById('producto');
    const empleadoSelect = document.getElementById('empleado');
    const cancelButton = document.getElementById('cancel-button'); // Botón de cancelar


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

    loadProductos();
    loadEmpleados();

    // Manejar el envío del formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const data = {
            producto: productoSelect.value,
            empleado: empleadoSelect.value,
            fecha: document.getElementById('fecha').value,
            tipo_ajuste: document.getElementById('tipo_ajuste').value,
            cantidad: document.getElementById('cantidad').value,
            precio_costo: document.getElementById('precio_costo').value,
        };

        fetch('/ajustes/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'El ajuste fue agregado exitosamente.',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        form.reset();
                        history.go(-1);
                        history.replaceState(null, '', '/list_ajustes.html'); // Cambiar la URL actual a /list_area
                        history.replaceState(null, '', '/home.html');
                        setTimeout(() => {
                            location.reload(); // Asegura que la página se recargue
                        }, 100);
                        window.location.href = '/list_ajustes.html'; // Redirige tras el éxito
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error || 'No se pudo agregar el ajuste.',
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
                console.error('Error al agregar ajuste:', error);
            });
    });

    cancelButton.addEventListener('click', function () {
        window.location.href = '../list_ajustes.html'; // Regresa a la página anterior
    });

});
